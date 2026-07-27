import{r as n,p as c,l as i,s as l}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{i as d,s as r}from"./ui-CfSCUwhT.js";import{u,d as m}from"./quiz-CdZykAFh.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./leaderboard-P9WSWk3A.js";const p=await n(["admin"]);c(p);d();document.getElementById("logout-btn").addEventListener("click",i);async function a(){try{const{data:t,error:s}=await l.from("quizzes").select("*, course:courses(name, subject:subjects(name)), creator:profiles(full_name)").order("created_at",{ascending:!1});if(s)throw s;const o=document.getElementById("quizzes-table");if(!t.length){o.innerHTML='<tr><td colspan="5" style="text-align:center">Quizzes නොමැත.</td></tr>';return}o.innerHTML=t.map(e=>`
      <tr>
        <td>${e.course?.subject?.name||""} - ${e.course?.name||""}</td>
        <td><strong>${e.title}</strong></td>
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
    `).join("")}catch(t){r(t.message,"error")}}window.toggleClosed=async(t,s)=>{try{await u(t,{is_closed:s}),r("යාවත්කාලීන කරන ලදී","success"),a()}catch(o){r(o.message,"error")}};window.delQuiz=async(t,s)=>{if(confirm(`"${s}" Quiz එක සහ ඒ ආශ්‍රිත සියලුම ප්‍රතිඵල මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await m(t),r("Quiz එක මකා දමන ලදී","success"),a()}catch(o){r(o.message,"error")}};a();
