import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

export const deleteScores = functions
    .region("europe-west1")
    .firestore.document('users/{userId}')
    .onDelete((snapshot, context) => {
        const {userId} = context.params;
        return admin.firestore().collection(`users/${userId}/scores`).listDocuments()
            .then(docs => docs.forEach(doc => doc.delete()))
            .catch(err => console.log(err));
    });
