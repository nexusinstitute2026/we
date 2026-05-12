import{c as y,k as h}from"./ui-DbSpmO8X.js";/* empty css              *//* empty css               */import{c as w,b as p}from"./quiz-Dw9to9Jg.js";const f=await y(["student"]),x=new URLSearchParams(window.location.search),s=x.get("quiz");s||(window.location.href="/dashboard/student.html");try{const[o,e]=await Promise.all([w(s),p(s,f.id)]);e||(window.location.href="/pages/quiz.html?id="+s);const l=o.questions.length,i=e.score,r=Math.round(i/l*100);r>=75&&confetti({particleCount:150,spread:80,origin:{y:.6},colors:["#0d9488","#f59e0b","#7c3aed"]}),document.getElementById("results-loader").style.display="none",document.getElementById("results-content").style.display="block",document.getElementById("quiz-title").textContent=o.title,document.getElementById("score-num").textContent=i,document.getElementById("score-total").textContent=`OUT OF ${l}`;const d=document.getElementById("ring-fill"),a=r/100*360-45;d.style.transform=`rotate(${a}deg)`,r<50&&(d.style.borderColor="var(--rose)"),e.rank&&(document.getElementById("rank-container").style.display="block",document.getElementById("rank-num").textContent=`#${e.rank}`),document.getElementById("stat-percentage").textContent=`${r}%`,document.getElementById("stat-time").textContent=h(e.time_taken),document.getElementById("stat-correct").textContent=i;const m=o.questions.map((t,n)=>{const c=e.answers[n],g=c===t.correct;return`
      <div class="review-card-premium reveal">
        <div class="rev-q">${n+1}. ${t.text}</div>
        <div class="rev-list">
          ${c!==null&&!g?`
            <div class="rev-ans-box wrong">
              <div class="rev-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
              <div><strong>ඔබේ පිළිතුර:</strong> ${t.options[c]}</div>
            </div>
          `:""}
          <div class="rev-ans-box correct">
            <div class="rev-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><strong>නිවැරදි පිළිතුර:</strong> ${t.options[t.correct]}</div>
          </div>
        </div>
      </div>
    `}).join("");document.getElementById("review-list").innerHTML=m;const v=document.querySelectorAll(".reveal"),u=new IntersectionObserver(t=>{t.forEach(n=>{n.isIntersecting&&n.target.classList.add("visible")})},{threshold:.1});v.forEach(t=>u.observe(t))}catch(o){console.error(o),showToast("Results පූරණය කිරීමේදී දෝෂයක්","error")}
