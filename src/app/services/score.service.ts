import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserScore } from '../model/user-scores.interface';
import { GameDifficulty } from '../model/game-difficulty.enum';
import { updateOrSet } from "../operators/update-or-set.operator";

@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
    ) {
    }

    private userScoresCollection$(): Observable<AngularFirestoreCollection<UserScore>> {
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
        return this.userScoresCollection$().pipe(
            switchMap(doc => {
                if (!doc) {
                    return of([] as UserScore[]);
                }
                return doc.valueChanges();
            }),
        );
    }

    resetProgress(difficulty: GameDifficulty): Promise<void> {
        const partialScore: Partial<UserScore> = {difficulty, currentLevel: 1};
        return this.userScoresCollection$().pipe(
            take(1),
            filter(doc => !!doc),
            map(collection => collection.doc<UserScore>(difficulty)),
            updateOrSet(partialScore),
        ).toPromise();
    }

    updateBestScore(difficulty: GameDifficulty, score: number): Promise<void> {
        const scoreToSave: Partial<UserScore> = {difficulty, currentLevel: score + 1};
        let scoreDoc: AngularFirestoreDocument<UserScore>;
        return this.userScoresCollection$().pipe(
            take(1),
            filter(doc => !!doc),
            switchMap(collection => {
                scoreDoc = collection.doc<UserScore>(difficulty);
                return scoreDoc.get();
            }),
            switchMap(doc => {
                if (!doc.data() || !doc.data().score || doc.data().score < score) {
                    scoreToSave.score = score;
                }
                return doc.data() ?
                    scoreDoc.update(scoreToSave)
                    : scoreDoc.set({difficulty: scoreToSave.difficulty, score: scoreToSave.score, currentLevel: scoreToSave.currentLevel});
            }),
        ).toPromise().then(() => null);
    }

    fetchUserScore$(difficulty: GameDifficulty): Observable<UserScore> {
        return this.fetchUserScores$().pipe(
            map(scores => scores.find(s => s.difficulty === difficulty))
        );
    }
}
