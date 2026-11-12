import {actionButton,artPanel,createPopupFrame,element,statRow} from '../../components/PopupFrame/PopupFrame';
import type {PayrollAction,PayrollViewModel} from './PayrollViewModel';
import '../../components/PopupFrame/PopupFrame.css';
import './PayrollView.css';
export interface PayrollView {setModel(model:Readonly<PayrollViewModel>):void;destroy():void}
export function mountPayrollView(host:HTMLElement,model:Readonly<PayrollViewModel>,onAction:(action:PayrollAction)=>void):PayrollView {
 let current=model;
 const render=()=>{
   const frame=createPopupFrame({title:'Payroll',modifier:'payroll',onClose:()=>onAction({type:'closeRequested'})});
   frame.body.append(artPanel(current.illustrationSrc,'Coins, treasure chest and a gold-filled pay bag','payroll'));
   const money=element('section','dt-money-summary');
   money.append(statRow({id:'gold',icon:'🪙',label:'Current Gold',value:current.currentGoldText}),statRow({id:'upkeep',icon:'⌛',label:'Upkeep (Salaries)',value:current.upkeepText,tone:'negative'}),statRow({id:'balance',icon:'🪙',label:'After Payment',value:current.afterPaymentText,tone:current.afterPaymentTone}));
   frame.body.append(money);
   const heading=element('div','dt-section-heading');heading.append(element('span','','◆'),element('h2','','Minion Salaries'),element('span','','◆'));frame.body.append(heading);
   const groupList=element('div','dt-salary-groups');
   for(const group of current.groups){const card=element('article','dt-salary-card');card.dataset.groupId=group.id;
     if(group.portraitSrc){const img=element('img','dt-salary-card__face');img.src=group.portraitSrc;img.alt='';card.append(img);}
     else {card.append(element('span','dt-salary-card__emoji',group.emoji??'👹'));}
     const details=element('div','dt-salary-card__details');details.append(element('strong','dt-salary-card__name',group.label),element('span','dt-salary-card__count',group.countLabel),element('span','dt-salary-card__value','🪙 '+group.salaryText));card.append(details);groupList.append(card);
   }
   frame.body.append(groupList);
   if(current.statusMessage)frame.body.append(element('p',`dt-payroll-status dt-payroll-status--${current.status}`,current.statusMessage));
   frame.footer.append(actionButton('Close','outline',()=>onAction({type:'closeRequested'}),false,'×'));
   const pay=actionButton(current.status==='paid'?'Paid':'Pay All','gold',()=>onAction({type:'payAllRequested'}),!current.canPayAll,'🪙');
   if(current.disabledReason)pay.title=current.disabledReason;
   frame.footer.append(pay);host.replaceChildren(frame.root);
 };
 render();return {setModel(m){current=m;render();},destroy(){host.replaceChildren();}};
}
