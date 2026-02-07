from openai import AsyncOpenAI
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.config import settings
from .models import AIRequest, AIResponse, MessageRole
from .prompts import SYSTEM_PROMPT, INTENT_CLASSIFICATION_PROMPT
from src.models.agent import KnowledgeFile


from src.modules.agent.service import AgentService

class AIEngineService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )
        self.model = settings.OPENAI_MODEL

    async def process_message(
        self,
        request: AIRequest,
        chat_history: Optional[List[dict]] = None,
        db: Optional[AsyncSession] = None
    ) -> AIResponse:
        """
        Main entry point for processing a message.
        1. Retrieve Knowledge
        2. Retrieve Agent Config
        3. Classify Intent
        4. Generate Response (LLM)
        """
        # Retrieve knowledge and config if db provided
        knowledge_context = ""
        agent_config = None
        
        if db:
            agent_service = AgentService(db)
            
            # Get agent config
            try:
                agent_config = await agent_service.get_config()
            except Exception as e:
                print(f"Error retrieving agent config: {e}")

            # Get knowledge
            try:
                result = await db.execute(select(KnowledgeFile))
                files = result.scalars().all()
                knowledge_texts = [f"--- {f.filename} ---\n{f.content}" for f in files if f.content]
                if knowledge_texts:
                    knowledge_context = "\n\nБАЗА ЗНАНИЙ:\n" + "\n".join(knowledge_texts)
            except Exception as e:
                print(f"Error retrieving knowledge: {e}")

        # Format chat history for context
        history_str = ""
        if chat_history:
            for msg in chat_history[-10:]:  # Last 10 messages for context
                role = "Клиент" if msg.get("role") == "user" else "AI"
                history_str += f"{role}: {msg.get('content', '')}\n"

        # Classify intent
        intent = await self._classify_intent(request.text)

        # Generate response
        response_text = await self._generate_response(
            user_message=request.text,
            chat_history=history_str,
            business_context=(request.context.get("business_info", "") if request.context else "") + "\n" + knowledge_context,
            agent_config=agent_config
        )

        return AIResponse(
            text=response_text,
            intent=intent,
            confidence=0.95,
            suggested_actions=self._get_suggested_actions(intent)
        )

    async def _classify_intent(self, text: str) -> str:
        """
        Classify user intent using LLM.
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": INTENT_CLASSIFICATION_PROMPT.format(message=text)}
                ],
                max_tokens=20,
                temperature=0.1
            )
            intent = response.choices[0].message.content.strip().lower()
            valid_intents = ["booking_request", "pricing_query", "general_inquiry", "complaint", "handoff_request"]
            return intent if intent in valid_intents else "general_inquiry"
        except Exception as e:
            print(f"Intent classification error: {e}")
            return "general_inquiry"

    async def _generate_response(
        self,
        user_message: str,
        chat_history: str = "",
        business_context: str = "",
        agent_config = None
    ) -> str:
        """
        Generate AI response using OpenAI.
        """
        # Default values if config is missing
        name = "Profit Flow AI"
        role = "умный бизнес-ассистент"
        tone = "дружелюбным и профессиональным"
        system_instructions = ""

        if agent_config:
            name = agent_config.name or name
            role = agent_config.role or role
            tone = agent_config.tone or tone
            system_instructions = agent_config.system_prompt or ""

        system_message = SYSTEM_PROMPT.format(
            name=name,
            role=role,
            tone=tone,
            system_instructions=system_instructions,
            business_context=business_context or "Информация о бизнесе не указана.",
            chat_history=chat_history or "Это начало диалога."
        )

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=800,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Response generation error: {e}")
            return "Извините, произошла ошибка. Попробуйте позже или свяжитесь с оператором."

    def _get_suggested_actions(self, intent: str) -> List[str]:
        """
        Return suggested actions based on intent.
        """
        actions_map = {
            "booking_request": ["show_calendar", "suggest_slots"],
            "pricing_query": ["show_prices", "offer_discount"],
            "general_inquiry": ["provide_info", "suggest_faq"],
            "complaint": ["escalate_to_human", "apologize"],
            "handoff_request": ["connect_operator"]
        }
        return actions_map.get(intent, ["provide_info"])


ai_service = AIEngineService()
