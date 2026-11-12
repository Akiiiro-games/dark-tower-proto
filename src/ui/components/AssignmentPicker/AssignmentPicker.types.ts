import type { MinionPortrait } from '../MinionComponent/MinionComponent.types';
/** Generic candidate display contract. Host calculates all costs, eligibility and transitions. */
export interface AssignmentCandidateViewModel {
  readonly id: string;
  readonly name: string;
  readonly portrait: MinionPortrait;
  readonly detail: string;
  readonly costLabel: string;
  readonly durationLabel: string;
  readonly selectable: boolean;
  readonly disabledReason?: string;
}
export interface AssignmentPickerViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly candidates: readonly AssignmentCandidateViewModel[];
  readonly emptyLabel?: string;
}
export interface AssignmentPickerHandle { setModel(model: Readonly<AssignmentPickerViewModel>):void;destroy():void; }
