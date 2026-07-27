import{r as _,l as $,s as m}from"./auth-CsePVUDx.js";/* empty css              *//* empty css             *//* empty css                  */import{b}from"./payment-DFZoGcm3.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";await _(["student"]);document.getElementById("logout-btn").addEventListener("click",$);const x=new URLSearchParams(window.location.search),g=x.get("id");async function E(){if(!g)return window.location.href="../dashboard/student.html";try{const{data:{user:s}}=await m.auth.getUser();if(!s)throw new Error("ලොග් වී නොමැත.");const i=await b(s.id),{data:r,error:h}=await m.from("sections").select(`name, is_hidden,
        categories(id, name, is_hidden,
          subjects(id, name, is_hidden,
            teacher:profiles(full_name, address),
            courses(id, name, is_free, is_hidden, payments_paused, fee)
          )
        )`).eq("id",g).single();if(h)throw h;if(!r)throw new Error("පන්ති මාලාව හමු නොවීය.");if(r.is_hidden)throw new Error("මෙම පන්ති මාලාව දැනට ලබා ගත නොහැකිය.");document.getElementById("page-title").innerHTML=`${r.name} <span>පන්ති</span>`;const p=(r.categories||[]).filter(o=>!o.is_hidden);let t="";if(!p.length)t='<div class="empty-state"><h3>පන්ති තවම ඇතුළත් කර නොමැත.</h3><p>පරිපාලක විසින් ඉක්මනින් පන්ති එකතු කරනු ඇත.</p></div>';else for(const o of p){t+=`<div class="cat-wrap">
          <div class="cat-title">${o.name}</div>`;const u=(o.subjects||[]).filter(a=>!a.is_hidden);if(!u.length)t+='<p style="color:var(--text-muted);padding:0 1rem">විෂයයන් තවම ඇතුළත් කර නොමැත.</p>';else for(const a of u){const v=a.teacher?.address||"../images/default_avatar.png";t+=`<div class="sub-wrap">
              <div class="sub-title">
                ${a.name}
                <span class="sub-teacher">
                  <img src="${v}" class="t-img" alt="Teacher" onerror="this.src='../images/default_avatar.png'">
                  ${a.teacher?.full_name||"Teacher TBD"}
                </span>
              </div>
              <div class="courses-list">`;const f=(a.courses||[]).filter(e=>!e.is_hidden);f.length?t+=f.map(e=>{const w=i.some(y=>y.course_id===e.id);let l,d,c,n;if(w)l=`../pages/course-months.html?id=${e.id}`,d='<polyline points="9 18 15 12 9 6"/>',c="පන්ති නරඹන්න",n="var(--teal)";else if(e.is_free)l=`javascript:enrollFreeAndRedirect('${e.id}')`,d='<polyline points="9 18 15 12 9 6"/>',c="නොමිලේ සම්බන්ධ වන්න",n="var(--teal)";else{if(e.payments_paused)return`
                    <div class="course-btn" style="opacity:0.7;cursor:default;pointer-events:none">
                      <img src="https://picsum.photos/300/160?random=${e.id}" class="c-img" alt="${e.name}">
                      <div class="c-body">
                        <div style="display:flex;flex-direction:column;gap:0.3rem">
                          <span class="c-name">${e.name}</span>
                          <span style="font-size:0.78rem;color:var(--gold);font-weight:700">⏸ ගෙවීම් තාවකාලිකව නවතා ඇත</span>
                        </div>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      </div>
                    </div>`;l=`../pages/payment.html?course_id=${e.id}`,d='<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',c="Register / Pay",n="var(--rose)"}return`
                  <a href="${l}" class="course-btn">
                    <img src="https://picsum.photos/300/160?random=${e.id}" class="c-img" alt="${e.name}">
                    <div class="c-body">
                      <div style="display:flex;flex-direction:column;gap:0.3rem">
                        <span class="c-name">${e.name}</span>
                        <span style="font-size:0.85rem;color:${n};font-weight:700">${c}</span>
                      </div>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${n}" stroke-width="2">${d}</svg>
                    </div>
                  </a>`}).join(""):t+='<p style="font-size:0.85rem;color:var(--text-muted)">පන්ති (Courses) තවම ඇතුළත් කර නැත.</p>',t+="</div></div>"}t+="</div>"}document.getElementById("content-area").innerHTML=t}catch(s){console.error(s),alert("දෝෂයකි: "+s.message),window.location.href="../dashboard/student.html"}}window.enrollFreeAndRedirect=async s=>{try{const{data:{user:i}}=await m.auth.getUser();if(!i)throw new Error("ලොග් වී නොමැත.");const{error:r}=await m.from("enrollments").upsert([{student_id:i.id,course_id:s}],{onConflict:"student_id,course_id"});if(r)throw r;window.location.href=`../pages/course-months.html?id=${s}`}catch(i){console.error(i),alert("සම්බන්ධ වීමට නොහැකි විය: "+i.message)}};E();
