import{r as d,p as u,l as m,s as f}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{i as p,s as n}from"./ui-CfSCUwhT.js";import{u as g,d as b}from"./quiz-CdZykAFh.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./leaderboard-P9WSWk3A.js";const z=await d(["admin"]);u(z);p();document.getElementById("logout-btn").addEventListener("click",m);async function l(){try{const{data:t,error:s}=await f.from("quizzes").select("*, course:courses(name, subject:subjects(name)), creator:profiles(full_name)").order("created_at",{ascending:!1});if(s)throw s;const o=document.getElementById("quizzes-table");if(!t.length){o.innerHTML='<tr><td colspan="4" style="text-align:center">Quizzes නොමැත.</td></tr>';return}const c={};t.forEach(r=>{const a=`${r.course?.subject?.name||""} - ${r.course?.name||"Unknown Course"}`;c[a]||(c[a]=[]),c[a].push(r)});let i="";for(const[r,a]of Object.entries(c))i+=`<tr style="background:#f1f5f9"><td colspan="4" style="font-weight:800;color:var(--teal)">${r}</td></tr>`,a.forEach(e=>{i+=`
          <tr>
            <td style="padding-left:2rem"><strong>${e.title}</strong></td>
            <td>${e.creator?.full_name||"-"}</td>
            <td>
              ${e.is_closed?'<span class="status-badge" style="background:#fee2e2;color:#ef4444">Closed (No Answers)</span>':'<span class="status-badge" style="background:#dcfce7;color:#22c55e">Accepting Answers</span>'}
            </td>
            <td>
              <button class="btn btn-sm ${e.is_closed?"btn-teal":"btn-rose"}" onclick="toggleClosed('${e.id}', ${!e.is_closed})">
                ${e.is_closed?"Open Quiz":"Close Quiz"}
              </button>
              <button class="btn btn-sm btn-outline" style="color:var(--rose);border-color:var(--rose);margin-left:0.5rem" onclick="delQuiz('${e.id}', '${e.title.replace(/'/g,"\\'")}')">
                Delete
              </button>
            </td>
          </tr>
        `});o.innerHTML=i}catch(t){n(t.message,"error")}}window.toggleClosed=async(t,s)=>{try{await g(t,{is_closed:s}),n("යාවත්කාලීන කරන ලදී","success"),l()}catch(o){n(o.message,"error")}};window.delQuiz=async(t,s)=>{if(confirm(`"${s}" Quiz එක සහ ඒ ආශ්‍රිත සියලුම ප්‍රතිඵල මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await b(t),n("Quiz එක මකා දමන ලදී","success"),l()}catch(o){n(o.message,"error")}};l();
