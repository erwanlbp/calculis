import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { collection, collectionData, CollectionReference, doc, DocumentReference, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
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
        private firestore: Firestore,
        private authService: AuthService,
    ) {
    }

    private userScoresCollection$(): Observable<CollectionReference<UserScore>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return collection(this.firestore,`users/${userId}/scores`) as CollectionReference<UserScore>;
            })
        );
    }

    fetchUserScores$(): Observable<UserScore[]> {
        return this.userScoresCollection$().pipe(
            switchMap(collection => {
                if (!collection) {
                    return of([] as UserScore[]);
                }
                return collectionData<UserScore>(collection);
            }),
        );
    }

    resetProgress(difficulty: GameDifficulty): Promise<void> {
        const partialScore: Partial<UserScore> = {difficulty, currentLevel: 1};
        return this.userScoresCollection$().pipe(
            take(1),
            filter(doc => !!doc),
            map((collection:CollectionReference<UserScore>) => doc(collection, difficulty)),
            updateOrSet(partialScore),
        ).toPromise();
    }

    updateBestScore(difficulty: GameDifficulty, score: number): Promise<void> {
        const scoreToSave: Partial<UserScore> = {difficulty, currentLevel: score + 1};
        let scoreDoc: DocumentReference<UserScore>;
        return this.userScoresCollection$().pipe(
            take(1),
            filter(doc => !!doc),
            switchMap(collection => {
                scoreDoc = doc<UserScore>(collection, difficulty);
                return getDoc(scoreDoc);
            }),
            switchMap(doc => {
                if (!doc.data() || !doc.data().score || doc.data().score < score) {
                    scoreToSave.score = score;
                }
                return doc.data() ?
                    updateDoc(scoreDoc, scoreToSave)
                    : setDoc(scoreDoc, {difficulty: scoreToSave.difficulty, score: scoreToSave.score, currentLevel: scoreToSave.currentLevel});
            }),
        ).toPromise().then(() => null);
    }

    fetchUserScore$(difficulty: GameDifficulty): Observable<UserScore> {
        return this.fetchUserScores$().pipe(
            map(scores => scores.find(s => s.difficulty === difficulty))
        );
    }
}
