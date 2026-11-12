import type {StatRowViewModel} from '../../components/PopupFrame/PopupFrame';
export interface VictoryViewModel {
  title:string;message:string;illustrationSrc:string;
  stats:readonly StatRowViewModel[];
  canEnterNextWorld:boolean;nextWorldDisabledReason?:string;canContinue:boolean;
}
export type VictoryAction={type:'nextWorldRequested'} | {type:'continueRequested'};
