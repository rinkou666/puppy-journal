export const GOAL_ICONS=[['move','运动'],['weight','哑铃'],['tennis','网球'],['badminton','羽毛球'],['yoga','瑜伽'],['climb','攀岩'],['run','跑步'],['bike','骑行'],['book','阅读'],['flower','学习'],['time','计时'],['heart','爱心']];
export function suggestIcon(name,category='其他'){for(const [pattern,id] of [[/羽毛球|badminton/i,'badminton'],[/瑜伽|拉伸|yoga|stretch/i,'yoga'],[/网球|tennis/i,'tennis'],[/攀岩|抱石|climb|boulder/i,'climb'],[/跑步|慢跑|run/i,'run'],[/骑行|单车|自行车|bike|cycl/i,'bike'],[/哑铃|举铁|力量/,'weight'],[/卷腹|提膝|踢腿|运动|健身|深蹲|俯卧撑|仰卧起坐|弓步|跳绳/,'move'],[/阅读|读书|单词|英语|西班牙|西语/,'book'],[/平板|支撑|计时/,'time']])if(pattern.test(name))return id;return category==='运动'?'move':'heart'}
// Dates are calendar dates in Tokyo; UTC arithmetic avoids host DST changes.
export const START='2026-11-09', END='2026-12-31';
export const uid=()=>crypto.randomUUID();
export function today(now=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export const dateValue=d=>Date.parse(d+'T00:00:00Z');
export const plusDays=(d,n)=>new Date(dateValue(d)+n*86400000).toISOString().slice(0,10);
export function isDate(d){return typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(dateValue(d))&&new Date(dateValue(d)).toISOString().slice(0,10)===d&&d>='1900-01-01'&&d<='2200-12-31'}
export const round=n=>Math.round(n*1e6)/1e6;
export function initial(){return {version:1,revision:0,goals:[['卷腹',1000,'次','运动','move'],['哑铃后举',1000,'次','运动','weight'],['英语单词',1000,'个','学习','book'],['西班牙语单词',1000,'个','学习','flower'],['平板支撑',6000,'分钟','运动','time']].map((g,i)=>({id:uid(),name:g[0],target:g[1],unit:g[2],category:g[3],icon:g[4],kind:i===4?'duration':'count'})),entries:[]}}
export function total(data,id,from='0000-01-01',to='9999-12-31'){return round(data.entries.filter(e=>e.goalId===id&&e.date>=from&&e.date<=to).reduce((s,e)=>s+e.amount,0))}
export const percent=(data,g)=>Math.min(100,total(data,g.id)/g.target*100);
export function amountText(g,n){if(g.kind==='duration'){n=Math.round(n);return `${Math.floor(n/60)}分${n%60?`${n%60}秒`:n===0?'00秒':''}`}return `${round(n).toLocaleString('zh-CN')} ${g.unit}`}
export function numericTarget(g){return g.kind==='duration'?g.target/60:g.target}
export function weekRanges(date=today()){const day=new Date(dateValue(date)).getUTCDay(),start=plusDays(date,-((day+6)%7));return{current:[start,plusDays(start,6)],previous:[plusDays(start,-7),plusDays(start,-1)]}}
export function summary(data,date=today()){const active=data.goals.filter(g=>total(data,g.id,date,date)>0).length;return{active,finished:data.goals.filter(g=>total(data,g.id)>=g.target).length,average:data.goals.length?data.goals.reduce((s,g)=>s+percent(data,g),0)/data.goals.length:0,todayCount:data.entries.filter(e=>e.date===date).length}}
export function validate(raw,date=today()){
 if(!raw||typeof raw!=='object')throw Error('数据格式不正确。');
 const d=structuredClone(raw);if(d.version!==1||!Number.isSafeInteger(d.revision)||d.revision<0||!Array.isArray(d.goals)||!Array.isArray(d.entries)||d.goals.length>200||d.entries.length>100000)throw Error('数据版本或结构不正确。');
 const str=(v,max)=>typeof v==='string'&&v.length>0&&v.length<=max;
 const positive=n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=1e9;
 const ids=new Set();
 for(const g of d.goals){if(!str(g.id,100)||ids.has(g.id)||!str(g.name,40)||!g.name.trim()||!str(g.unit,12)||!g.unit.trim()||!['运动','学习','其他'].includes(g.category)||!GOAL_ICONS.some(([id])=>id===g.icon)||!positive(g.target)||!['count','duration'].includes(g.kind)||g.kind==='duration'&&(!Number.isInteger(g.target)||g.unit!=='分钟'))throw Error('挑战数据无效。');ids.add(g.id)}
 const entries=new Set();for(const e of d.entries){const g=d.goals.find(g=>g.id===e.goalId);if(!str(e.id,100)||entries.has(e.id)||!g||!positive(e.amount)||g.kind==='duration'&&!Number.isInteger(e.amount)||!isDate(e.date)||e.date>date||!str(e.createdAt,50)||isNaN(Date.parse(e.createdAt)))throw Error('记录包含无效数值、未来日期或缺失的挑战。');entries.add(e.id)}
 return {version:1,revision:d.revision,goals:d.goals.map(g=>({id:g.id,name:g.name,target:g.target,unit:g.unit,category:g.category,icon:g.icon,kind:g.kind})),entries:d.entries.map(e=>({id:e.id,goalId:e.goalId,amount:e.amount,date:e.date,createdAt:e.createdAt}))};
}
export function record(data,goalId,amount,date=today(),id=uid()){
 const next={...data,entries:[...data.entries,{id,goalId,amount,date,createdAt:new Date().toISOString()}]};return validate(next);
}
export function removeEntry(data,id){return {...data,entries:data.entries.filter(e=>e.id!==id)}}
export function removeGoal(data,id){return {...data,goals:data.goals.filter(g=>g.id!==id),entries:data.entries.filter(e=>e.goalId!==id)}}
export function editEntry(data,id,amount,date){return validate({...data,entries:data.entries.map(e=>e.id===id?{...e,amount,date}:e)})}
export function saveGoal(data,goal){const old=data.goals.find(g=>g.id===goal.id);if(old&&data.entries.some(e=>e.goalId===old.id)&&(old.unit!==goal.unit||old.kind!==goal.kind))throw Error('已有记录的挑战不能更换单位，请新建一个挑战。');return validate({...data,goals:old?data.goals.map(g=>g.id===goal.id?goal:g):[...data.goals,goal]})}
