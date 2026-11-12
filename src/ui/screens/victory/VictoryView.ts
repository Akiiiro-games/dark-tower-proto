import {actionButton,artPanel,createPopupFrame,element,statRow} from '../../components/PopupFrame/PopupFrame';
import '../../components/PopupFrame/PopupFrame.css';
import type {VictoryAction,VictoryViewModel} from './VictoryViewModel';
import './VictoryView.css';
export interface VictoryView {setModel(model:Readonly<VictoryViewModel>):void;destroy():void}
export function mountVictoryView(host:HTMLElement,model:Readonly<VictoryViewModel>,onAction:(action:VictoryAction)=>void):VictoryView{
 let current=model;
 const render=()=>{
   const frame=createPopupFrame({title:'Victory',modifier:'victory'});
   frame.body.append(artPanel(current.illustrationSrc,'The Dark Tower triumphant beneath an illuminated crown','victory'));
   frame.body.append(element('h2','dt-feature-title dt-feature-title--victory',current.title),element('p','dt-ending-message',current.message));
   const stats=element('section','dt-ending-stats');for(const stat of current.stats)stats.append(statRow(stat));frame.body.append(stats);
   const next=actionButton('Next World','gold',()=>onAction({type:'nextWorldRequested'}),!current.canEnterNextWorld,'»');if(current.nextWorldDisabledReason)next.title=current.nextWorldDisabledReason;
   frame.footer.append(next,actionButton('Continue','outline',()=>onAction({type:'continueRequested'}),!current.canContinue,'▶'));host.replaceChildren(frame.root);
 };
 render();return {setModel(m){current=m;render();},destroy(){host.replaceChildren();}};
}
