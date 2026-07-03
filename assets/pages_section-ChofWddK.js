import{r as w,l as v,s as m}from"./auth-8lOPc_Ms.js";/* empty css              *//* empty css             *//* empty css                  */import{b as y}from"./payment-BOiYUFGx.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";await w(["student"]);document.getElementById("logout-btn").addEventListener("click",v);const $=new URLSearchParams(window.location.search),h=$.get("id");async function b(){if(!h)return window.location.href="../dashboard/student.html";try{const{data:{user:e}}=await m.auth.getUser();if(!e)throw new Error("ලොග් වී නොමැත.");const r=await y(e.id),{data:t,error:u}=await m.from("sections").select("name, categories(id, name, subjects(id, name, teacher:profiles(full_name, address), courses(id, name, is_free)))").eq("id",h).single();if(u)throw u;if(!t)throw new Error("පන්ති මාලාව හමු නොවීය.");document.getElementById("page-title").innerHTML=`${t.name} <span>පන්ති</span>`;let a="";if(!t.categories||t.categories.length===0)a='<div class="empty-state"><h3>පන්ති තවම ඇතුළත් කර නොමැත.</h3><p>පරිපාලක විසින් ඉක්මනින් පන්ති එකතු කරනු ඇත.</p></div>';else for(const n of t.categories){if(a+=`<div class="cat-wrap">
          <div class="cat-title">${n.name}</div>`,!n.subjects||n.subjects.length===0)a+='<p style="color:var(--text-muted);padding:0 1rem">විෂයයන් තවම ඇතුළත් කර නොමැත.</p>';else for(const o of n.subjects){const p=o.teacher?.address||"../images/default_avatar.png";a+=`<div class="sub-wrap">
              <div class="sub-title">
                ${o.name} 
                <span class="sub-teacher">
                  <img src="${p}" class="t-img" alt="Teacher"> 
                  ${o.teacher?.full_name||"Teacher TBD"}
                </span>
              </div>
              <div class="courses-list">
                ${o.courses&&o.courses.length>0?o.courses.map(s=>{const g=r.some(f=>f.course_id===s.id);let l,c,d,i;return g?(l=`../pages/course-months.html?id=${s.id}`,c='<polyline points="9 18 15 12 9 6"/>',d="පන්ති නරඹන්න",i="var(--teal)"):s.is_free?(l=`javascript:enrollFreeAndRedirect('${s.id}')`,c='<polyline points="9 18 15 12 9 6"/>',d="නොමිලේ සම්බන්ධ වන්න",i="var(--teal)"):(l=`../pages/payment.html?course_id=${s.id}`,c='<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',d="Register / Pay",i="var(--rose)"),`
                  <a href="${l}" class="course-btn">
                    <img src="https://picsum.photos/300/160?random=${s.id}" class="c-img" alt="${s.name}">
                    <div class="c-body">
                      <div style="display:flex;flex-direction:column;gap:0.3rem">
                        <span class="c-name">${s.name}</span>
                        <span style="font-size:0.85rem;color:${i};font-weight:700">${d}</span>
                      </div>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${i}" stroke-width="2">${c}</svg>
                    </div>
                  </a>
                `}).join(""):'<p style="font-size:0.85rem;color:var(--text-muted)">පන්ති (Courses) තවම ඇතුළත් කර නැත.</p>'}
              </div>
            </div>`}a+="</div>"}document.getElementById("content-area").innerHTML=a}catch(e){console.error(e),alert("දෝෂයකි: "+e.message),window.location.href="../dashboard/student.html"}}window.enrollFreeAndRedirect=async e=>{try{const{data:{user:r}}=await m.auth.getUser();if(!r)throw new Error("ලොග් වී නොමැත.");const{error:t}=await m.from("enrollments").upsert([{student_id:r.id,course_id:e}],{onConflict:"student_id,course_id"});if(t)throw t;window.location.href=`../pages/course-months.html?id=${e}`}catch(r){console.error(r),alert("සම්බන්ධ වීමට නොහැකි විය: "+r.message)}};b();
