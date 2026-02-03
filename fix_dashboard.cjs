const fs = require('fs');
const path = 'components/SupervisorDashboard.tsx';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Ensure Import (Check if already present or needs adding)
    // The previous replace_file_content might have added it, or failed.
    // We'll check.
    if (!content.includes('import FoodCostTemplateChart')) {
        // Find existing import block end
        content = content.replace("} from 'lucide-react';", "} from 'lucide-react';\nimport FoodCostTemplateChart from './FoodCostTemplateChart';");
        console.log('Import added.');
    } else {
        console.log('Import already present.');
    }

    // 2. Remove Commented Block
    // We look for the start behavior we created.
    // The start marker is the commented out div line.
    const startMarker = '{/* <div className="bg-[#0f2420] border-2 border-brand-gold/40';
    // The end marker is the closing div logic we observed.
    const endMarker = '</div> */}';

    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
        const length = (endIndex + endMarker.length) - startIndex;
        const toReplace = content.substring(startIndex, startIndex + length);
        content = content.replace(toReplace, '');
        console.log('Commented block removed.');
    } else {
        console.log('Commented block not found via markers.');
        if (startIndex !== -1) console.log('Start found at ' + startIndex);
        if (startIndex === -1) console.log('Start marker not found: ' + startMarker.substring(0, 50));
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log('File updated.');

} catch (e) {
    console.error('Error:', e);
}
