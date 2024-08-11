# FCM Send

![Firebase Cloud Messaging](https://github.com/MFori/apify-fcm-send/blob/master/img/fcm.png?raw=true "Firebase Cloud Messaging")

This actor can be used as integration with Firebase Cloud Messaging. It sends a message to a device, group of
devices or topics. The message can be fully customized supporting all FCM options.

## Targets option

- **Device id(s)** - Send a message to a specific device or group of devices.
- **Topic** - Send a message to a topic.
- **Condition** - Send a message to a condition.

## Input

The input of this actor should be JSON containing the following fields:

| Field             | Required | Type          | Description                                                                                                                                   |
|-------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| serviceAccountKey | true     | string        | Service account key in JSON format. You can get it from Firebase Console -> Project Settings -> Service accounts -> Generate new private key. |
| deviceTokens      | false*   | string array  | Array of device tokens to send the message to.                                                                                                |
| topic             | false*   | string        | Topic to send the message to.                                                                                                                 |
| condition         | false*   | string        | Condition to send the message to.                                                                                                             |
| notification      | true     | object (json) | Notification object to send. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message for more details. |
| data              | false    | object (json) | Data object to send. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message for more details.         |
| android           | false    | object (json) | Android specific options. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#androidconfig for more details.        |
| webPush           | false    | object (json) | WebPush specific options. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#webpushconfig for more details.        |
| apns              | false    | object (json) | APNs specific options. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#apnsconfig for more details.              |
| fcmOptions        | false    | object (json) | FCM options. See https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#fcmoptions for more details.                        |

*One of the targets (deviceTokens, topic or condition) is required.

Example of the input:

```json
{
  "serviceAccountKey": "{\n  \"type\": \"service_account\",\n  \"project_id\": \"your-project-id\",\n  \"private_key_id\": \"someprivatekeyid1234567890abcdef\",\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\\n-----END PRIVATE KEY-----\\n\",\n  \"client_email\": \"firebase-adminsdk-abcde@your-project-id.iam.gserviceaccount.com\",\n  \"client_id\": \"123456789012345678901\",\n  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abcde%40your-project-id.iam.gserviceaccount.com\"\n}",
  "deviceTokens": [
    "eZc9N8F-3wIaFQq2_rU2K_v2A3QlUd9X9C-zQIBvE0pA1zCxPtF7A3H3Pl_m8TlPQAlnvlH2WmD4kKz3WodL8w"
  ],
  "notification": {
    "title": "FCM Send",
    "body": "Hello from FCM Send!"
  }
}
```

## Output

The output of this actor is list of objects (for each message sent) containing the following fields:

| Field     | Required | Type    | Description           |
|-----------|----------|---------|-----------------------|
| messageId | false    | string  | Unique FCM message id |
| success   | true     | boolean | true if message sent  |
| error     | false    | string  | Error message         |

Example of the output:

```json
[
   {
      "messageId": "/projects/your-project-id/messages/0:7f2a1b345cde678f9120abcd34567890",
      "success": true
   },
   {
      "success": false,
      "error": "The registration token is not a valid FCM registration token"
   }
]
```

## How to customize the notification

The notification can be fully customized, see https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#resource:-message for more details.
