javascript:(function(){
  const T=(s)=>s&&s.innerText?s.innerText.trim():"";
  const norm=(txt)=>txt.replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  const clickAll=(filterRe)=>{[...document.querySelectorAll('button, a')].filter(b=>b&&/see more|more|...more/i.test(b.textContent)).forEach(b=>{try{b.click()}catch(e){}});};
  clickAll();

  // Core selectors w/ fallbacks (LI changes classes often)
  const name = T(document.querySelector('.pv-text-details__left-panel h1')) || T(document.querySelector('h1.text-heading-xlarge')) || T(document.querySelector('h1'));
  const headline = T(document.querySelector('.pv-text-details__left-panel .text-body-medium')) || T(document.querySelector('.text-body-medium.break-words'));
  const aboutSec = document.querySelector('section[id*="about"], section.pv-about-section, div#about');
  const about = aboutSec ? norm(aboutSec.innerText.replace(/^About\s*/i,'')) : '';

  // Experience section: take first 6 visible items
  const expSec = document.querySelector('section[id*="experience"], section.pv-profile-section.experience-section, div#experience');
  let experiences=[];
  if(expSec){
    const items=[...expSec.querySelectorAll('li, .pvs-entity')].slice(0,6);
    experiences = items.map(li=>{
      // Try to pull lines: role, company, dates/location
      const lines = [...li.querySelectorAll('span[aria-hidden="true"], .t-14, .t-16, .mr1')].map(s=>s.innerText.trim()).filter(Boolean);
      const uniq = [...new Set(lines)].filter(x=>!/^·$/.test(x) && !/^See less$/i.test(x));
      const short = uniq.join(' — ').replace(/\s+—\s+/g,' — ').replace(/\s{2,}/g,' ').trim();
      return short || li.innerText.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,3).join(' — ');
    }).filter(Boolean);
  }

  // Education section: take first 4 items
  const eduSec = document.querySelector('section[id*="education"], section.pv-profile-section.education-section, div#education');
  let education=[];
  if(eduSec){
    const items=[...eduSec.querySelectorAll('li, .pvs-entity')].slice(0,4);
    education = items.map(li=>{
      const lines=[...li.querySelectorAll('span[aria-hidden="true"], .t-14, .t-16, .mr1')].map(s=>s.innerText.trim()).filter(Boolean);
      const uniq=[...new Set(lines)].filter(Boolean);
      return uniq.join(' — ').replace(/\s{2,}/g,' ').trim() || li.innerText.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,3).join(' — ');
    }).filter(Boolean);
  }

  const url = location.href.split('?')[0];
  const today = new Date().toISOString().slice(0,10);

  const md =
`# ${name||'(Name not found)'}
**${headline||''}**

[LinkedIn Profile](${url})

## Summary
${about||'_No summary visible._'}

## Experience
${(experiences.length?experiences:['(No visible experience entries)']).map(x=>`- ${x}`).join('\n')}

## Education
${(education.length?education:['(No visible education entries)']).map(x=>`- ${x}`).join('\n')}

---

**Quick facts**
- Added: ${today}
- Source: LinkedIn
`;

  const out = md.replace(/\n{3,}/g,'\n\n');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(out).then(()=>alert('✅ Markdown copied. Paste into Notion.')).catch(()=>prompt('Copy Markdown:', out));
  }else{
    prompt('Copy Markdown:', out);
  }
})();
