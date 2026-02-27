
import re
import os

file_path = r'c:\Users\jordy\ECO-ARCHITECTURE\components\DashboardPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix malformed tags
content = content.replace('</main >', '</main>')
content = content.replace('</div >', '</div>')
content = content.replace('< div ', '<div ')
content = content.replace('<main >', '<main>')
content = content.replace('</ main >', '</main>')
content = content.replace('</ main>', '</main>')

# Fix specific lines seen in view_file
content = re.sub(r'< div className\s*=', '<div className=', content)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully fixed DashboardPage.tsx")
