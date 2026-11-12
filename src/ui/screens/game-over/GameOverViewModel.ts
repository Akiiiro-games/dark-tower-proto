import type {StatRowViewModel} from '../../components/PopupFrame/PopupFrame';
export interface GameOverViewModel {
  reasonTitle:string;message:string;illustrationSrc:string;
  stats:readonly StatRowViewModel[];
  retryAvailable:boolean;mainMenuAvailable:boolean;
}
export type GameOverAction={type:'retryRequested'} | {type:'mainMenuRequested'};
