import {actionButton,artPanel,createPopupFrame,element,statRow} from '../../components/PopupFrame/PopupFrame';
import '../../components/PopupFrame/PopupFrame.css';
import type {GameOverAction,GameOverViewModel} from './GameOverViewModel';
import './GameOverView.css';
export interface GameOverView {setModel(model:Readonly<GameOverViewModel>):void;destroy():void}
export function mountGameOverView(host:HTMLElement,model:Readonly<GameOverViewModel>,onAction:(action:GameOverAction)=>void):GameOverView{
 let current=model;
 const render=()=>{
   const frame=createPopupFrame({title:'Game Over',modifier:'game-over'});
   frame.body.append(artPanel(current.illustrationSrc,'The ruined Dark Tower under a blood-red moon','game-over'));
   frame.body.append(element('h2','dt-feature-title dt-feature-title--danger',current.reasonTitle),element('p','dt-ending-message',current.message));
   const stats=element('section','dt-ending-stats');for(const stat of current.stats) stats.append(statRow(stat));frame.body.append(stats);
   frame.footer.append(actionButton('Retry','gold',()=>onAction({type:'retryRequested'}),!current.retryAvailable,'↻'),actionButton('Main Menu','outline',()=>onAction({type:'mainMenuRequested'}),!current.mainMenuAvailable,'⌂'));
   host.replaceChildren(frame.root);
 };
 render();return{setModel(m){current=m;render();},destroy(){host.replaceChildren();}};
}
