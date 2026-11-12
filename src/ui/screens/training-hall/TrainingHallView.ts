import { mountRoomOverviewCard } from '../../components/RoomOverviewCard/RoomOverviewCard';
import { mountUpgradeCard } from '../../components/UpgradeCard/UpgradeCard';
import type { UpgradeCardHandle } from '../../components/UpgradeCard/UpgradeCard.types';
import { mountTrainingStation } from '../../components/TrainingStation/TrainingStation';
import type { TrainingStationHandle } from '../../components/TrainingStation/TrainingStation.types';
import { mountAssignmentPicker } from '../../components/AssignmentPicker/AssignmentPicker';
import type { AssignmentPickerHandle } from '../../components/AssignmentPicker/AssignmentPicker.types';
import type { TrainingHallActionHandler, TrainingHallViewHandle, TrainingHallViewModel } from './TrainingHallViewModel';
import './TrainingHallView.css';

interface Mounted<T>{ host:HTMLElement; handle:T }
/** Reusable screen composition; no game rules or simulated time in the View. */
export function mountTrainingHallView(host:HTMLElement, initial:Readonly<TrainingHallViewModel>, onAction:TrainingHallActionHandler):TrainingHallViewHandle{
 const abort=new AbortController();
 const root=document.createElement('main');root.className='dt-training-hall';
 root.innerHTML=`
 <div class="dt-training-hall__mountains" aria-hidden="true"></div>
 <div class="dt-training-hall__shell"><section class="dt-training-hall__window" aria-label="Training Hall window">
   <section class="dt-training-hall__upper" aria-label="Room information and upgrades">
      <div class="dt-training-hall__room"></div>
      <section class="dt-training-hall__upgrades" aria-label="Upgrades">
        <button class="dt-training-hall__scroll-arrow dt-training-hall__scroll-arrow--left" type="button" aria-label="Scroll upgrades left">‹</button>
        <div class="dt-training-hall__upgrade-viewport" tabindex="0" aria-label="Horizontal list of Training Hall upgrades"><div class="dt-training-hall__upgrade-track"></div></div>
        <button class="dt-training-hall__scroll-arrow dt-training-hall__scroll-arrow--right" type="button" aria-label="Scroll upgrades right">›</button>
        <div class="dt-training-hall__upgrade-dots" aria-hidden="true"><span></span><span></span><span></span></div>
      </section>
   </section>
   <section class="dt-training-hall__stations-section" aria-label="Training stations">
     <div class="dt-training-hall__stations-topline"><span class="dt-training-hall__stations-title"></span><span class="dt-training-hall__stations-count"></span></div>
     <div class="dt-training-hall__stations-viewport" tabindex="0" aria-label="Scrollable training stations"><div class="dt-training-hall__stations-grid"></div>
       <div class="dt-training-hall__no-stations" role="status" hidden><span>⚔️</span><strong>No stations available</strong><p></p></div>
     </div>
   </section>
 </section></div><div class="dt-training-hall__picker-host"></div>`;
 const required=<T extends Element=HTMLElement>(selector:string):T=>{const el=root.querySelector<T>(selector);if(!el)throw new Error(`TrainingHallView missing ${selector}`);return el;};
 const room=mountRoomOverviewCard(required<HTMLElement>('.dt-training-hall__room'),initial.room,{variant:'embedded'});
 const upgradeViewport=required<HTMLElement>('.dt-training-hall__upgrade-viewport');
 const upgradeTrack=required<HTMLElement>('.dt-training-hall__upgrade-track');
 const stationsViewport=required<HTMLElement>('.dt-training-hall__stations-viewport');
 const stationGrid=required<HTMLElement>('.dt-training-hall__stations-grid');
 const noStations=required<HTMLElement>('.dt-training-hall__no-stations');
 const pickerHost=required<HTMLElement>('.dt-training-hall__picker-host');
 const prev=required<HTMLButtonElement>('.dt-training-hall__scroll-arrow--left');
 const next=required<HTMLButtonElement>('.dt-training-hall__scroll-arrow--right');
 const dots=Array.from(root.querySelectorAll<HTMLElement>('.dt-training-hall__upgrade-dots span'));
 const upgrades=new Map<string,Mounted<UpgradeCardHandle>>();
 const stations=new Map<string,Mounted<TrainingStationHandle>>();
 let picker:AssignmentPickerHandle|undefined;
 let selectedStationId:string|undefined;
 let disposed=false;
 function updateArrows(){
   const end=Math.max(0,upgradeViewport.scrollWidth-upgradeViewport.clientWidth);
   prev.disabled=upgradeViewport.scrollLeft<=2;next.disabled=upgradeViewport.scrollLeft>=end-2;
   const proportion=end?upgradeViewport.scrollLeft/end:0;
   dots.forEach((d,i)=>d.classList.toggle('dt-training-hall__dot--active',i===(end?Math.min(dots.length-1,Math.round(proportion*(dots.length-1))):0)));
 }
 const scroll=(direction:1|-1)=>upgradeViewport.scrollBy({left:direction*Math.min(500,upgradeViewport.clientWidth*.8),behavior:'smooth'});
 prev.addEventListener('click',()=>scroll(-1),{signal:abort.signal});next.addEventListener('click',()=>scroll(1),{signal:abort.signal});
 upgradeViewport.addEventListener('scroll',updateArrows,{signal:abort.signal,passive:true});
 upgradeViewport.addEventListener('wheel',(event:WheelEvent)=>{if(event.shiftKey&&event.deltaY){event.preventDefault();upgradeViewport.scrollLeft+=event.deltaY;}},{signal:abort.signal,passive:false});
 window.addEventListener('resize',updateArrows,{signal:abort.signal});
 function setModel(model:Readonly<TrainingHallViewModel>){
  if(disposed)return;
  room.setModel(model.room);
  required<HTMLElement>('.dt-training-hall__stations-title').textContent=model.stationsCaption;
  required<HTMLElement>('.dt-training-hall__stations-count').textContent=model.countCaption;
  required<HTMLElement>('.dt-training-hall__no-stations p').textContent=model.emptyMessage;
  root.classList.toggle('dt-training-hall--busy',!!model.busy);
  const upgradeIds=new Set(model.upgrades.map(u=>u.id));
  for(const [id,item] of upgrades)if(!upgradeIds.has(id)){item.handle.destroy();upgrades.delete(id);}
  const orderedUpgrades:HTMLElement[]=[];
  for(const data of model.upgrades){
   let item=upgrades.get(data.id);
   if(!item){const slot=document.createElement('div');slot.className='dt-training-hall__upgrade-slot';item={host:slot,handle:mountUpgradeCard(slot,data,upgradeId=>onAction({type:'upgradeRequested',upgradeId}))};upgrades.set(data.id,item);}
   else item.handle.setModel(data);
   orderedUpgrades.push(item.host);
  }
  if(upgradeTrack.childElementCount!==orderedUpgrades.length||orderedUpgrades.some((el,i)=>upgradeTrack.children[i]!==el))upgradeTrack.replaceChildren(...orderedUpgrades);
  const stationIds=new Set(model.stations.map(s=>s.id));
  for(const [id,item] of stations)if(!stationIds.has(id)){item.handle.destroy();stations.delete(id);}
  const orderedStations:HTMLElement[]=[];
  for(const data of model.stations){
   let item=stations.get(data.id);
   if(!item){const slot=document.createElement('div');slot.className='dt-training-hall__station-slot';item={host:slot,handle:mountTrainingStation(slot,data,action=>onAction(action))};stations.set(data.id,item);}
   else item.handle.setModel(data);
   orderedStations.push(item.host);
  }
  const previousScroll=stationsViewport.scrollTop;
  if(stationGrid.childElementCount!==orderedStations.length||orderedStations.some((el,i)=>stationGrid.children[i]!==el))stationGrid.replaceChildren(...orderedStations);
  stationsViewport.scrollTop=previousScroll;
  stationGrid.hidden=model.stations.length===0;noStations.hidden=model.stations.length!==0;
  if(!model.assignmentPicker){picker?.destroy();picker=undefined;selectedStationId=undefined;}
  else{
   // Stable selection is carried by the caller in the picker subtitle? The View records only the clicked station id in local presentation state.
   // But assigning is game-relevant, so that id must be supplied by the host, not inferred here.
   if(!model.assignmentStationId)throw new Error('assignmentStationId required while picker is visible');
   selectedStationId=model.assignmentStationId;
   if(picker)picker.setModel(model.assignmentPicker);
   else picker=mountAssignmentPicker(pickerHost,model.assignmentPicker,minionId=>onAction({type:'assignRequested',stationId:selectedStationId!,minionId}),()=>onAction({type:'assignmentCancelled'}));
  }
  updateArrows();
 }
 host.replaceChildren(root);setModel(initial);
 return {setModel,destroy(){if(disposed)return;disposed=true;abort.abort();picker?.destroy();room.destroy();for(const item of upgrades.values())item.handle.destroy();for(const item of stations.values())item.handle.destroy();upgrades.clear();stations.clear();root.remove();}};
}
