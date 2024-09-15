import {Actor} from 'apify';
import admin from 'firebase-admin';
import {
    BaseMessage, BatchResponse,
    ConditionMessage,
    MulticastMessage,
    TokenMessage,
    TopicMessage
} from "firebase-admin/messaging";

await Actor.init();

interface Input {
    serviceAccountKey: string;
    deviceTokens?: string[];
    topic?: string;
    condition?: string;
    notification: any;
    data?: any;
    android?: any;
    webpush?: any;
    apns?: any;
    fcmOptions?: any;
}

interface Result {
    messageId?: string;
    success: boolean;
    error?: string;
}

const input = await Actor.getInput<Input>();
if (!input) {
    await Actor.exit('Input is missing!', { exitCode: 1 });
    process.exit(1);
}

const { serviceAccountKey } = input;

try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (e: any) {
    await Actor.exit(`Failed to initialize Firebase Admin SDK: ${e.message}`, { exitCode: 0 });
}

let message: BaseMessage = {
    notification: input.notification,
    data: input.data,
    android: input.android,
    webpush: input.webpush,
    apns: input.apns,
    fcmOptions: input.fcmOptions,
};

const messaging = admin.messaging();
let result: Result[];

async function singleMessageToResult(promise: Promise<string>): Promise<Result[]> {
    try {
        const messageId = await promise;
        return [{messageId: messageId, success: true, error: undefined}];
    } catch (e: any) {
        return [{messageId: undefined, success: false, error: e?.message}];
    }
}

async function multipleMessageToResult(promise: Promise<BatchResponse>): Promise<Result[]> {
    try {
        const response = await promise;
        return response.responses.map((res) => {
           return {messageId: res.messageId, success: res.success, error: res.error?.message};
        });
    } catch (e: any) {
        return [{messageId: undefined, success: false, error: e?.message}];
    }
}

if (input.deviceTokens && input.deviceTokens.length === 1) {
    message = {token: input.deviceTokens[0], ...message} as TokenMessage;
    result = await singleMessageToResult(messaging.send(message as TokenMessage));
} else if (input.deviceTokens && input.deviceTokens.length > 1) {
    message = {tokens: input.deviceTokens, ...message} as MulticastMessage;
    result = await multipleMessageToResult(messaging.sendEachForMulticast(message as MulticastMessage));
} else if (input.topic) {
    message = {topic: input.topic, ...message} as TopicMessage;
    result = await singleMessageToResult(messaging.send(message as TopicMessage));
} else if (input.condition) {
    message = {condition: input.condition, ...message} as ConditionMessage;
    result = await singleMessageToResult(messaging.send(message as ConditionMessage));
} else {
    await Actor.exit(`deviceTokens, topic or condition must be provided!`, { exitCode: 1 });
    result = [];
}

await Actor.pushData(result);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit().
await Actor.exit();
