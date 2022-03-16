// Create HTTP server.
import { Activity, CardFactory, TeamsActivityHandler, TurnContext } from "botbuilder";
import * as restify from "restify";
import { adapter } from "./internal/initialize";
import crypto from "crypto"
import adCard from "./adaptiveCards/helloworldCommand.json"
import heroCard from "./adaptiveCards/heroCard.json"

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

// Process Teams activity with Bot Framework.
const handler = new TeamsActivityHandler();
server.post("/api/messages", async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        await handler.run(context);
    });
});

// Process out-going webhook
const sharedSecret = process.env.WEBHOOK_SECRET;
const bufSecret = Buffer.from(sharedSecret, "base64");

server.post("/api/command", (req, res) => {
    try {
        // Retrieve authorization HMAC information
        const auth = req.headers['authorization'];
        const payload = req.body;
        
        // Calculate HMAC on the message we've received using the shared secret			
        const msgBuf = Buffer.from(JSON.stringify(payload), 'utf8');
        const msgHash = "HMAC " + crypto.createHmac('sha256', bufSecret).update(msgBuf).digest("base64");

        let resMsg: any;
        if (msgHash === auth) {
            // The text received to webhook
            let receivedText = payload.text;

            // The message sent by webhook       
            switch (true) {
                case (receivedText.indexOf("ad-card") != -1):
                    // Creating adaptive card res
                    resMsg = {
                        type: "message",
                        attachments: [
                            CardFactory.adaptiveCard(adCard)                           
                        ]
                    };
                    
                    break;
                case (receivedText.indexOf("hero-card") != -1):
                    resMsg = {
                        type: "message",
                        attachments: [
                            CardFactory.heroCard(
                                "Seattle Center Monorail",
                                "The Seattle Center Monorail is an elevated train line between Seattle Center (near the Space Needle) and downtown Seattle. It was built for the 1962 World's Fair. Its original two trains, completed in 1961, are still in service.",
                                ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Seattle_monorail01_2008-02-25.jpg/1024px-Seattle_monorail01_2008-02-25.jpg"]
                        )]
                    };
                    break;
                default:
                    // Sending plain text as res message	
                    resMsg = {
                        type: "message",
                        text: `**You typed**: ' + ${receivedText} + ' \n **Commands supported**: test, command1, command2`
                    };
                    break;
            }
        } else {
            resMsg = { type: "message", text: "Error: message sender cannot be authenticated." };
        }

        res.json(resMsg);
    } catch (err) {
        res.writeHead(400);
        res.send("Error: " + err + "\n" + err.stack);
    }
});