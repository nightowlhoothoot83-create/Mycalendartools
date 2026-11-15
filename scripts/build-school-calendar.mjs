import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('data/school-calendar-au-2026.json','utf8'));
const date=value=>new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
const shift=(value,days)=>{const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);};
for(const kind of ['school-holidays','school-term-dates']){
  const terms=kind==='school-term-dates';
  const regionBlocks=data.regions.map(region=>{
    const rows=terms?region.terms.map((term,i)=>`<tr><td>Term ${i+1}</td><td>${date(term.start)}</td><td>${date(term.end)}</td></tr>`):region.terms.map((term,i)=>`<tr><td>${i<3?'After Term '+(i+1):'Summer break starts'}</td><td>${date(shift(term.end,1))}</td><td>${i<3?date(shift(region.terms[i+1].start,-1)):'Check the 2027 student return date in the official calendar'}</td></tr>`);
    return `<details class="card school-region" data-school-region="${region.id}" style="padding:20px;margin-top:16px"><summary style="cursor:pointer;font-weight:700">${region.name} — ${data.year}</summary><p>${region.note}</p><div style="overflow-x:auto"><table class="holidays-table"><thead><tr><th>${terms?'Term':'Student break'}</th><th>First day</th><th>Last day</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p><a href="${region.source}" target="_blank" rel="noopener">Official ${region.name} calendar and future years</a></p></details>`;
  }).join('\n');
  const block=`<!-- school-calendar:start -->
<section id="australian-school-calendar"><h2>${data.year} government-school ${terms?'student term dates':'student breaks'} by state and territory</h2><p>Checked against the linked education authorities on 16 November 2026. ${terms?'Dates below use student attendance boundaries.':'Breaks below are the inclusive days between student terms, including weekends, public holidays and system-wide student-free days beside term boundaries. They may be longer than the officially named vacation period.'} School-specific closures and mid-term student-free days are not included. Confirm your school calendar.</p><p>Use the region selector above, or open a state below. For 2027 and later years, open the relevant official calendar; these tables cover 2026 only.</p>${regionBlocks}</section>
<!-- school-calendar:end -->`;
  const file=`${kind}/australia/index.html`,input=fs.readFileSync(file,'utf8');
  const output=input.replace(/<!-- school-calendar:start -->[\s\S]*?<!-- school-calendar:end -->/,block);
  if(!input.includes('<!-- school-calendar:start -->'))throw Error('Missing school calendar marker: '+file);
  if(process.argv.includes('--check')){if(input!==output)throw Error('Regenerate school calendar: '+file);}else fs.writeFileSync(file,output);
}
console.log('Australian school calendar tables are current with the checked source data.');
