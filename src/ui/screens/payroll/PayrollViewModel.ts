export interface PayrollGroupViewModel {id:string;label:string;countLabel:string;portraitSrc?:string;emoji?:string;salaryText:string;}
export interface PayrollViewModel {
  currentGoldText:string;
  upkeepText:string;
  afterPaymentText:string;
  afterPaymentTone:'positive'|'negative';
  groups:readonly PayrollGroupViewModel[];
  status:'due'|'paid'|'pending';
  canPayAll:boolean;
  disabledReason?:string;
  statusMessage?:string;
  illustrationSrc:string;
}
export type PayrollAction = {type:'payAllRequested'} | {type:'closeRequested'};
