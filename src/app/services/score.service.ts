import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserScore } from '../model/user-scores.interface';
import { GameDifficulty } from '../model/game-difficulty.enum';

@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
    ) {
    }

    private userScoresCollection(): Observable<AngularFirestoreCollection<UserScore>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.collection<UserScore>(`users/${userId}/scores`);
            })
        );
    }

    fetchUserScores$(): Observable<UserScore[]> {
        return this.userScoresCollection().pipe(
            switchMap(doc => {
                if (!doc) {
                    return of([] as UserScore[]);
                }
                return doc.valueChanges();
            }),
            map((scores: UserScore[]) => scores.sort((a, b) => a.difficulty > b.difficulty ? -1 : a.difficulty < b.difficulty ? 1 : 0))
        );
    }

    updateBestScore(difficulty: GameDifficulty, score: number): Promise<void> {
        let scoreDoc: AngularFirestoreDocument<UserScore>;
        return this.userScoresCollection().pipe(
            take(1),
            filter(doc => !!doc),
            switchMap(collection => {
                scoreDoc = collection.doc<UserScore>(difficulty);
                return scoreDoc.get();
            }),
            filter(doc => !doc.data() || doc.data().score < score),
            switchMap(doc => scoreDoc.set({difficulty, score}))
        ).toPromise();
    }
}
