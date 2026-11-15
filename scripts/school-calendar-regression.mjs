import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({document:{addEventListener(){}}});
vm.runInContext(fs.readFileSync('components.js','utf8'),context);
assert.equal(context.getTodayHoliday(new Date(2026,10,16)),null,'Unlisted dates must not borrow another day’s holiday');
assert.equal(context.getTodayHoliday(new Date(2026,4,4)).name,'Star Wars Day');
assert.equal(context.getTodayHoliday(new Date(2026,10,13)).name,'World Kindness Day');

const data=JSON.parse(fs.readFileSync('data/school-calendar-au-2026.json','utf8'));
assert.equal(data.year,2026);assert.equal(data.regions.length,9);
for(const region of data.regions){
  assert.equal(region.terms.length,4);
  assert.equal(new URL(region.source).protocol,'https:');
  for(let i=0;i<4;i++){
    const {start,end}=region.terms[i];
    assert.match(start,/^2026-\d{2}-\d{2}$/);assert.ok(start<=end);
    if(i)assert.ok(region.terms[i-1].end<start);
  }
}
assert.equal(data.regions.find(x=>x.id==='QLD').terms[3].end,'2026-12-11');
assert.equal(data.regions.find(x=>x.id==='NSW-W').terms[0].start,'2026-02-09');
assert.equal(data.regions.find(x=>x.id==='NSW-E').terms[1].start,'2026-04-22');
assert.equal(data.regions.find(x=>x.id==='NT').terms[3].end,'2026-12-10');

const elements=new Map();
for(const id of ['school-location','school-location-note','school-country','school-region','school-region-label','school-location-link','school-selection-note'])elements.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,listeners:{},addEventListener(event,fn){this.listeners[event]=fn;}});
const panels=data.regions.map(r=>({dataset:{schoolRegion:r.id},open:false}));
const location={pathname:'/school-term-dates/australia/',search:'?region=ACT'};
const ui=vm.createContext({document:{readyState:'loading',addEventListener(){},getElementById:id=>elements.get(id),querySelectorAll:()=>panels},location,URLSearchParams,Intl,Date});
vm.runInContext(fs.readFileSync('school-location.js','utf8'),ui);
for(const [zone,country,region] of [['Australia/Brisbane','australia','QLD'],['Australia/Sydney','australia',''],['Australia/Melbourne','australia','VIC'],['Pacific/Auckland','new-zealand',''],['Europe/London','united-kingdom',''],['Etc/UTC','','']]){
  const result=ui.schoolLocationSuggestion(zone);assert.equal(result.country,country);assert.equal(result.region,region);
}
ui.initSchoolLocation();
assert.equal(elements.get('school-region').value,'ACT','Explicit school region overrides browser suggestion');
assert.equal(panels.find(x=>x.dataset.schoolRegion==='ACT').open,true);
const country=elements.get('school-country');
for(const id of ['australia','new-zealand','united-kingdom','united-states','canada','south-africa']){
  country.value=id;country.listeners.change();
  const target=elements.get('school-location-link').href.split('?')[0];
  assert.ok(fs.existsSync('.'+target+'index.html'),'School selector must link to an existing page: '+target);
}
const sa=fs.readFileSync('school-holidays/south-africa/index.html','utf8');
assert.match(sa,/10 Dec 2026 \(learners\)/);assert.doesNotMatch(sa,/10 or 12 Dec/);
console.log('School date, local observance, region override and country navigation checks passed.');
