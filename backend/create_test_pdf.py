#!/usr/bin/env python3
"""Create a test PDF with auto parts prices for agent knowledge base."""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register a font that supports Cyrillic
try:
    pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
    font_name = 'DejaVu'
except:
    font_name = 'Helvetica'

def create_price_list():
    doc = SimpleDocTemplate(
        "test_prices.pdf",
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName=font_name,
        fontSize=20,
        spaceAfter=30,
        alignment=1  # Center
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontName=font_name,
        fontSize=12,
        spaceAfter=20
    )
    
    # Title
    elements.append(Paragraph("ПРАЙС-ЛИСТ АВТОЗАПЧАСТЕЙ", title_style))
    elements.append(Paragraph("Магазин 'АвтоДетали' - Оренбург", subtitle_style))
    elements.append(Paragraph("Актуален на февраль 2026 года", subtitle_style))
    elements.append(Spacer(1, 20))

    # Lada Granta parts
    elements.append(Paragraph("LADA GRANTA", ParagraphStyle('Section', fontName=font_name, fontSize=14, spaceAfter=10)))
    
    granta_data = [
        ["Наименование", "Артикул", "Цена, руб."],
        ["Бампер передний (оригинал)", "2190-2803015", "7 500"],
        ["Бампер задний (оригинал)", "2190-2804015", "6 800"],
        ["Бампер передний (аналог)", "AT-2190-FB", "4 200"],
        ["Фара передняя левая", "2190-3711011", "5 400"],
        ["Фара передняя правая", "2190-3711010", "5 400"],
        ["Капот", "2190-8402010", "8 900"],
        ["Крыло переднее левое", "2190-8403011", "3 200"],
        ["Крыло переднее правое", "2190-8403010", "3 200"],
        ["Радиатор охлаждения", "2190-1301012", "4 500"],
        ["Генератор 90А", "2190-3701010", "6 200"],
        ["Стартер", "2190-3708010", "4 800"],
        ["Тормозные колодки передние (комплект)", "2190-3501090", "1 200"],
        ["Тормозные колодки задние (комплект)", "2190-3502090", "900"],
        ["Диск тормозной передний", "2190-3501070", "1 800"],
        ["Амортизатор передний", "2190-2905002", "2 500"],
        ["Амортизатор задний", "2190-2915004", "2 100"],
    ]
    
    table = Table(granta_data, colWidths=[10*cm, 4*cm, 3*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 30))

    # Lada Vesta parts
    elements.append(Paragraph("LADA VESTA", ParagraphStyle('Section', fontName=font_name, fontSize=14, spaceAfter=10)))
    
    vesta_data = [
        ["Наименование", "Артикул", "Цена, руб."],
        ["Бампер передний (оригинал)", "8450006683", "12 500"],
        ["Бампер задний (оригинал)", "8450006684", "11 200"],
        ["Фара передняя левая LED", "8450006666", "18 500"],
        ["Фара передняя правая LED", "8450006667", "18 500"],
        ["Капот", "8450006650", "14 200"],
        ["Решетка радиатора", "8450006620", "4 800"],
        ["Радиатор охлаждения", "8450006700", "7 200"],
        ["Генератор 110А", "8450006800", "9 500"],
        ["Тормозные колодки передние (комплект)", "8450006900", "1 800"],
        ["Амортизатор передний", "8450007000", "3 800"],
    ]
    
    table2 = Table(vesta_data, colWidths=[10*cm, 4*cm, 3*cm])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(table2)
    elements.append(Spacer(1, 30))

    # Additional info
    info_style = ParagraphStyle('Info', fontName=font_name, fontSize=10, spaceAfter=8)
    elements.append(Paragraph("УСЛОВИЯ РАБОТЫ:", ParagraphStyle('Section', fontName=font_name, fontSize=12, spaceAfter=10)))
    elements.append(Paragraph("• Доставка по городу: бесплатно от 5000 руб.", info_style))
    elements.append(Paragraph("• Доставка по области: от 300 руб.", info_style))
    elements.append(Paragraph("• Гарантия на запчасти: 12 месяцев", info_style))
    elements.append(Paragraph("• Возврат в течение 14 дней", info_style))
    elements.append(Paragraph("• Оплата: наличные, карта, переводом", info_style))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("Телефон: +7 (3532) 123-456", info_style))
    elements.append(Paragraph("Адрес: г. Оренбург, ул. Шевченко 20В", info_style))
    elements.append(Paragraph("Режим работы: Пн-Сб 9:00-19:00, Вс выходной", info_style))

    doc.build(elements)
    print("PDF создан: test_prices.pdf")

if __name__ == "__main__":
    create_price_list()
