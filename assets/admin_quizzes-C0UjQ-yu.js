import{r as m,p,l as f,s as g}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{i as z,s as o}from"./ui-CfSCUwhT.js";import{u as b,d as w}from"./quiz-CdZykAFh.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./leaderboard-P9WSWk3A.js";const y=await m(["admin"]);p(y);z();document.getElementById("logout-btn").addEventListener("click",f);async function u(){try{const{data:t,error:s}=await g.from("quizzes").select("*, course:courses(name, subject:subjects(name)), creator:profiles(full_name)").order("created_at",{ascending:!1});if(s)throw s;const a=document.getElementById("quizzes-table");if(!t.length){a.innerHTML='<tr><td colspan="4" style="text-align:center">Quizzes නොමැත.</td></tr>';return}const c={};t.forEach(r=>{const n=`${r.course?.subject?.name||""} - ${r.course?.name||"Unknown Course"}`;c[n]||(c[n]=[]),c[n].push(r)});let d="";for(const[r,n]of Object.entries(c))d+=`<tr style="background:#f1f5f9"><td colspan="4" style="font-weight:800;color:var(--teal)">${r}</td></tr>`,n.forEach(e=>{let i,l;e.is_closed?(i='<span class="status-badge" style="background:#fee2e2;color:#ef4444">Closed (No Answers)</span>',l=`
            <button class="btn btn-sm btn-teal" onclick="reopenQuiz('${e.id}')" title="Reopen so students can answer again (browser save only)">
              🔓 Reopen Quiz
            </button>
            <button class="btn btn-sm btn-outline" style="color:var(--rose);border-color:var(--rose);margin-left:0.5rem" onclick="delQuiz('${e.id}', '${e.title.replace(/'/g,"\\'")}')">
              Delete
            </button>
          `):e.is_reopened?(i='<span class="status-badge" style="background:#fef9c3;color:#ca8a04">Reopened (Browser Save)</span>',l=`
            <button class="btn btn-sm btn-rose" onclick="closeQuiz('${e.id}')">
              🔒 Close Quiz
            </button>
            <button class="btn btn-sm btn-outline" style="color:var(--rose);border-color:var(--rose);margin-left:0.5rem" onclick="delQuiz('${e.id}', '${e.title.replace(/'/g,"\\'")}')">
              Delete
            </button>
          `):(i='<span class="status-badge" style="background:#dcfce7;color:#22c55e">Accepting Answers</span>',l=`
            <button class="btn btn-sm btn-rose" onclick="closeQuiz('${e.id}')">
              🔒 Close Quiz
            </button>
            <button class="btn btn-sm btn-outline" style="color:var(--rose);border-color:var(--rose);margin-left:0.5rem" onclick="delQuiz('${e.id}', '${e.title.replace(/'/g,"\\'")}')">
              Delete
            </button>
          `),d+=`
          <tr>
            <td style="padding-left:2rem"><strong>${e.title}</strong></td>
            <td>${e.creator?.full_name||"-"}</td>
            <td>${i}</td>
            <td>${l}</td>
          </tr>
        `});a.innerHTML=d}catch(t){o(t.message,"error")}}window.closeQuiz=async t=>{try{await b(t,{is_closed:!0,is_reopened:!1}),o("Quiz එක වසා දමන ලදී","success"),u()}catch(s){o(s.message,"error")}};window.reopenQuiz=async t=>{if(confirm(`Quiz නැවත විවෘත කිරීමෙන් ශිෂ්‍යයන්ට නැවත පිළිතුරු දිය හැකිය.

නව පිළිතුරු database වෙත upload නොවනු ඇත — ඒවා ශිෂ්‍යයාගේ browser හි පමණක් සුරැකෙයි.

එය ඉදිරියට යා යුතුද?`))try{await b(t,{is_closed:!1,is_reopened:!0}),o("Quiz නැවත විවෘත කරන ලදී (Browser Save Mode)","success"),u()}catch(s){o(s.message,"error")}};window.delQuiz=async(t,s)=>{if(confirm(`"${s}" Quiz එක සහ ඒ ආශ්‍රිත සියලුම ප්‍රතිඵල මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await w(t),o("Quiz එක මකා දමන ලදී","success"),u()}catch(a){o(a.message,"error")}};u();
