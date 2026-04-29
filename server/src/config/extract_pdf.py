import pdfplumber
import json

pdf_path = r'C:\Users\hp\OneDrive\Desktop\TourismCO\up_0.pdf'
out_text = r'C:\Users\hp\OneDrive\Desktop\TourismCO\server\src\config\up_tourism_raw.txt'
out_tables = r'C:\Users\hp\OneDrive\Desktop\TourismCO\server\src\config\up_tourism_tables.json'

with pdfplumber.open(pdf_path) as pdf:
    all_text = ''
    tables = []
    for i, page in enumerate(pdf.pages):
        t = page.extract_text()
        if t:
            all_text += '\n--- PAGE ' + str(i+1) + ' ---\n' + t
        tbl = page.extract_tables()
        if tbl:
            tables.append({'page': i+1, 'tables': tbl})

    with open(out_text, 'w', encoding='utf-8') as f:
        f.write(all_text)

    with open(out_tables, 'w', encoding='utf-8') as f:
        json.dump(tables, f, ensure_ascii=False, indent=2)

    total_tables = sum(len(p['tables']) for p in tables)
    print('Total pages: ' + str(len(pdf.pages)))
    print('Total chars extracted: ' + str(len(all_text)))
    print('Total tables found: ' + str(total_tables))
    print('Done! Files saved.')
