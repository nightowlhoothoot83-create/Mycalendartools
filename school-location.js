/* Browser timezone is a suggestion, not a precise location or school district. */
function schoolLocationSuggestion(zone) {
  const au={'Australia/Brisbane':'QLD','Australia/Lindeman':'QLD','Australia/Melbourne':'VIC','Australia/Adelaide':'SA','Australia/Darwin':'NT','Australia/Perth':'WA','Australia/Eucla':'WA','Australia/Hobart':'TAS','Australia/Lord_Howe':'NSW-E'};
  if(zone.startsWith('Australia/'))return {country:'australia',region:au[zone]||''};
  if(['Pacific/Auckland','Pacific/Chatham'].includes(zone))return {country:'new-zealand',region:''};
  if(['Europe/London','Europe/Belfast'].includes(zone))return {country:'united-kingdom',region:''};
  if(zone==='Africa/Johannesburg')return {country:'south-africa',region:''};
  if(['America/Toronto','America/Vancouver','America/Winnipeg','America/Edmonton','America/Halifax','America/St_Johns','America/Regina','America/Whitehorse'].includes(zone))return {country:'canada',region:''};
  if(['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Phoenix','America/Anchorage','Pacific/Honolulu'].includes(zone))return {country:'united-states',region:''};
  return {country:'',region:''};
}

function initSchoolLocation(){
  const mount=document.getElementById('school-location');if(!mount)return;
  const countries=[['australia','Australia'],['new-zealand','New Zealand'],['united-kingdom','United Kingdom'],['united-states','United States'],['canada','Canada'],['south-africa','South Africa']];
  const regions=[['QLD','Queensland'],['NSW-E','NSW — Eastern division'],['NSW-W','NSW — Western division'],['VIC','Victoria'],['WA','Western Australia'],['SA','South Australia'],['TAS','Tasmania'],['ACT','Australian Capital Territory'],['NT','Northern Territory']];
  let zone='';try{zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch{}
  const suggestion=schoolLocationSuggestion(zone);
  const pageCountry=location.pathname.split('/')[2]||'';
  const params=new URLSearchParams(location.search);
  const requested=params.get('country');
  const country=countries.some(([id])=>id===requested)?requested:countries.some(([id])=>id===pageCountry)?pageCountry:suggestion.country;
  const requestedRegion=params.get('region');
  const region=regions.some(([id])=>id===requestedRegion)?requestedRegion:country===suggestion.country?suggestion.region:'';
  mount.innerHTML='<h2>Your school calendar region</h2><p id="school-location-note"></p><div style="display:flex;flex-wrap:wrap;align-items:end;gap:16px"><label>Country<br><select id="school-country" style="max-width:100%;padding:10px"><option value="">Choose country</option>'+countries.map(([id,label])=>'<option value="'+id+'">'+label+'</option>').join('')+'</select></label><label id="school-region-label">State or territory<br><select id="school-region" style="max-width:100%;padding:10px"><option value="">Choose region</option>'+regions.map(([id,label])=>'<option value="'+id+'">'+label+'</option>').join('')+'</select></label><a class="btn-primary" id="school-location-link" hidden>Open school calendar</a></div><p id="school-selection-note" style="margin-top:12px"></p>';
  const countrySelect=document.getElementById('school-country'),regionSelect=document.getElementById('school-region');
  countrySelect.value=country;regionSelect.value=region;
  document.getElementById('school-location-note').textContent='Your local date is '+new Intl.DateTimeFormat(undefined,{dateStyle:'full'}).format(new Date())+(zone?' ('+zone+').':'.')+' A browser timezone can suggest a country or region; choose where the student attends school. No GPS or IP-location lookup is used.';
  function update(){
    const au=countrySelect.value==='australia';document.getElementById('school-region-label').hidden=!au;
    const termCountry=['australia','new-zealand','united-kingdom','united-states'].includes(countrySelect.value);
    const group=location.pathname.startsWith('/school-term-dates/')&&termCountry?'school-term-dates':'school-holidays';
    const target=document.getElementById('school-location-link');target.hidden=!countrySelect.value;
    if(countrySelect.value){target.href='/'+group+'/'+countrySelect.value+'/' +(au&&regionSelect.value?'?region='+encodeURIComponent(regionSelect.value):'');}
    document.querySelectorAll('[data-school-region]').forEach(node=>{node.open=au&&node.dataset.schoolRegion===regionSelect.value;});
    document.getElementById('school-selection-note').textContent=!countrySelect.value?'Select a country to find its school calendar.':au?'NSW and the ACT share timezones with other regions, so confirm your selection. Tables cover 2026; official links include future years.':'School dates can depend on the school, council, province or district. The country page explains the applicable coverage and official sources.';
  }
  countrySelect.addEventListener('change',()=>{regionSelect.value=countrySelect.value===suggestion.country?suggestion.region:'';update();});
  regionSelect.addEventListener('change',update);update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSchoolLocation);else initSchoolLocation();
