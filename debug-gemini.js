const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'debug_log.txt');
fs.writeFileSync(logFile, "Starting Model List Debug...\n", 'utf8');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n", 'utf8');
}

function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        const cleaned = line.trim();
        if (!cleaned || cleaned.startsWith('#')) return;
        const splitIdx = cleaned.indexOf('=');
        if (splitIdx > 0) {
            const key = cleaned.substring(0, splitIdx).trim();
            let val = cleaned.substring(splitIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            process.env[key] = val;
        }
    });
    return true;
}

parseEnvFile(path.join(__dirname, '.env'));
parseEnvFile(path.join(__dirname, '.env.local'));

async function listModels() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        log("ERROR: No API Key found.");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    log(`Fetching models from: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            log(`Response Body: ${text}`);
            return;
        }

        const data = await response.json();
        if (data.models) {
            log(`\n✅ Found ${data.models.length} models:`);
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    log(` - ${m.name} (Supports generateContent)`);
                } else {
                    log(` - ${m.name} (No generateContent support)`);
                }
            });
        } else {
            log("✅ Request successful but 'models' list is empty/undefined.");
            log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        log(`❌ Network/Fetch Error: ${error.message}`);
    }
}

listModels();
