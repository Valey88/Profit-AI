import React, { useState } from 'react';
import { Check, Zap, Shield, Globe, Cpu, Headphones, Star, Users, Loader2 } from 'lucide-react';
import { usePlans, useSubscription, useCreateSubscription, useCancelSubscription } from '@/shared/api/hooks';
import type { Plan } from '@/shared/api/client';

export const BillingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const { data: plans, isLoading: isPlansLoading } = usePlans();
  const { data: subscription, isLoading: isSubLoading } = useSubscription();

  const createSubMutation = useCreateSubscription();
  const cancelSubMutation = useCancelSubscription();

  const handleSelectPlan = async (plan: Plan) => {
    // Determine if it's the current plan
    if (subscription?.plan.id === plan.id) {
      return;
    }

    try {
      await createSubMutation.mutateAsync({ planId: plan.id, isYearly });
    } catch (error) {
      console.error('Failed to change subscription:', error);
    }
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'starter': return Globe;
      case 'business': return Shield;
      case 'enterprise': return Headphones;
      default: return Zap;
    }
  };

  const isCurrentPlan = (planId: number) => {
    return subscription?.plan.id === planId;
  };

  if (isPlansLoading || isSubLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-extralight text-white tracking-tight mb-6">
            Выберите <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">мощность</span>
          </h1>
          <p className="text-lg text-zinc-400">
            Масштабируемые тарифы. Измените план в любое время.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isYearly ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isYearly ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
              Ежегодно <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => {
            const Icon = getPlanIcon(plan.type);
            const active = isCurrentPlan(plan.id);
            const price = isYearly ? plan.price_yearly : plan.price_monthly;
            const features = plan.features.split(',').map(f => f.trim());
            const isRecommended = plan.type === 'business';

            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-[2rem] border transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl ${active
                  ? 'bg-white/5 border-white/20 ring-1 ring-white/10'
                  : isRecommended
                    ? 'bg-gradient-to-b from-indigo-900/40 to-black/40 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-xl'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10 backdrop-blur-md'
                  }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-1 border border-white/20">
                    <Star className="w-3 h-3 fill-current" /> Рекомендуем
                  </div>
                )}

                {active && (
                  <div className="absolute top-6 right-6 bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                    ТЕКУЩИЙ
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isRecommended
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                    : 'bg-white/5 border-white/5 text-zinc-400'
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {price === 0 ? '0 ₽' : `${price.toLocaleString()} ₽`}
                  </span>
                  <span className="text-zinc-500 font-medium ml-2">{isYearly ? '/ год' : '/ мес'}</span>
                </div>

                <div className="space-y-4 mb-10">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={active || createSubMutation.isPending}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${active
                    ? 'bg-white/5 text-zinc-500 cursor-default border border-white/5'
                    : isRecommended
                      ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                >
                  {createSubMutation.isPending && !active ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : active ? (
                    'Активен'
                  ) : (
                    'Выбрать тариф'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {subscription && subscription.status === 'active' && !subscription.cancel_at_period_end && (
          <div className="mt-16 text-center">
            <button
              onClick={() => {
                if (confirm('Вы уверены, что хотите отменить подписку?')) {
                  cancelSubMutation.mutate();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors underline"
            >
              Отменить подписку
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Нужна помощь с выбором? <a href="#" className="text-white font-semibold underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">Свяжитесь с нами</a>
          </p>
        </div>

      </div>
    </div>
  );
};
