const DEFAULT_MODS = [
{id:"sodium",name:"Sodium",description:"مود لتحسين أداء العرض في Minecraft. هذه البطاقة تربطك بصفحة الملفات الرسمية على CurseForge.",versions:["1.21.4"],loaders:["Fabric","NeoForge"],category:"Performance",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Minecraft%20-%201.18%20mountains.jpg",download:"https://www.curseforge.com/minecraft/mc-mods/sodium/files/all?page=1&pageSize=20&version=1.21.4"},
{id:"jei",name:"Just Enough Items (JEI)",description:"عرض العناصر والوصفات داخل اللعبة ومعرفة طرق التصنيع بسرعة.",versions:["1.21.4","1.21.1"],loaders:["Fabric","NeoForge"],category:"Recipes",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Minecraft%20-%20Jungle.jpg",download:"https://www.curseforge.com/minecraft/mc-mods/jei/files/all?page=1&pageSize=20&version=1.21.4"},
{id:"appleskin",name:"AppleSkin",description:"يعرض معلومات إضافية عن الطعام والجوع داخل واجهة Minecraft.",versions:["1.21.4","1.21.1","1.21.11"],loaders:["Fabric","NeoForge"],category:"HUD",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Minecraft%20-%20Frozen%20ocean.jpg",download:"https://www.curseforge.com/minecraft/mc-mods/appleskin/files/all?gameVersionTypeId=6&page=1&version=1.21.4"}
];
const DEFAULT_MAPS=[
{id:"mountain",name:"Mountain Survival",description:"خريطة بطابع جبلي للاستكشاف والبقاء.",version:"1.21.4",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Minecraft%20-%201.18%20mountains.jpg",download:"https://www.curseforge.com/minecraft/search?search=mountain%20survival"},
{id:"nether",name:"Nether Adventure",description:"مغامرة بطابع Nether.",version:"1.21.4",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Screenshot%20from%20the%20Minecraft%20Nether.png",download:"https://www.curseforge.com/minecraft/search?search=nether%20adventure"},
{id:"deepdark",name:"Deep Dark",description:"استكشاف في أجواء مظلمة.",version:"1.21.4",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Minecraft%20-%20Deep%20Dark.png",download:"https://www.curseforge.com/minecraft/search?search=deep%20dark"}
];

function getData(key, fallback){try{const x=JSON.parse(localStorage.getItem(key));return Array.isArray(x)?x:fallback}catch{return fallback}}
function setData(key,data){localStorage.setItem(key,JSON.stringify(data))}
function mods(){return getData("mh_mods",DEFAULT_MODS)}
function maps(){return getData("mh_maps",DEFAULT_MAPS)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function setupUI(){
 const t=document.getElementById("themeButton"); if(t)t.onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("mh_theme",document.body.classList.contains("light")?"light":"dark");t.textContent=document.body.classList.contains("light")?"☀️":"🌙"};
 if(localStorage.getItem("mh_theme")==="light"){document.body.classList.add("light");if(t)t.textContent="☀️"}
 const menu=document.getElementById("menuToggle"),nav=document.getElementById("mainNav"); if(menu&&nav)menu.onclick=()=>nav.classList.toggle("open");
}
setupUI();

function modCard(m){
 return `<article class="card" onclick="location.href='mod.html?id=${encodeURIComponent(m.id)}'">
 <img class="mod-image" src="${escapeHTML(m.image)}" alt="${escapeHTML(m.name)}" loading="lazy">
 <div class="card-body"><div class="badges"><span class="badge">${escapeHTML(m.category)}</span>${m.versions.map(v=>`<span class="badge">${escapeHTML(v)}</span>`).join("")}</div>
 <h3>${escapeHTML(m.name)}</h3><p>${escapeHTML(m.description)}</p><div class="card-meta"><span>${m.loaders.map(escapeHTML).join(" · ")}</span><span>التفاصيل ↗</span></div>
 <a class="btn btn-small" href="${escapeHTML(m.download)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">📥 تحميل</a></div></article>`
}
function renderModsPage(){
 const grid=document.getElementById("modGrid"),q=document.getElementById("searchInput"),v=document.getElementById("versionFilter"),l=document.getElementById("loaderFilter"),empty=document.getElementById("emptyState");
 function go(){let x=mods().filter(m=>(!q.value||`${m.name} ${m.category} ${m.description}`.toLowerCase().includes(q.value.toLowerCase()))&&(v.value==="all"||m.versions.includes(v.value))&&(l.value==="all"||m.loaders.includes(l.value)));grid.innerHTML=x.map(modCard).join("");empty.classList.toggle("hidden",x.length>0)}
[q,v,l].forEach(e=>e.addEventListener(e===q?"input":"change",go));go();
}
function renderFeaturedMods(){const el=document.getElementById("featuredMods");if(el)el.innerHTML=mods().slice(0,3).map(modCard).join("")}
function renderMapsPage(){const g=document.getElementById("mapGrid"),e=document.getElementById("mapEmpty");let x=maps();g.innerHTML=x.map(m=>`<article class="image-card"><img src="${escapeHTML(m.image)}" alt="${escapeHTML(m.name)}" loading="lazy"><div class="image-card-body"><span class="badge">${escapeHTML(m.version)}</span><h3>${escapeHTML(m.name)}</h3><p>${escapeHTML(m.description)}</p><a class="btn btn-small" href="${escapeHTML(m.download)}" target="_blank" rel="noopener">📥 تحميل الخريطة</a></div></article>`).join("");e.classList.toggle("hidden",x.length>0)}

function renderModDetail(){
 const el=document.getElementById("modDetail"),id=new URLSearchParams(location.search).get("id"),m=mods().find(x=>x.id===id);
 if(!m){el.innerHTML='<div class="empty">المود غير موجود. <a href="../mods.html">العودة للمودات</a></div>';return}
 el.innerHTML=`<div class="detail-card"><img src="${escapeHTML(m.image)}" alt="${escapeHTML(m.name)}"><div class="detail-content"><div class="badges">${m.versions.map(v=>`<span class="badge">${escapeHTML(v)}</span>`).join("")}</div><h1>${escapeHTML(m.name)}</h1><p>${escapeHTML(m.description)}</p><div class="detail-grid"><span><b>الفئة</b>${escapeHTML(m.category)}</span><span><b>Loader</b>${m.loaders.map(escapeHTML).join(", ")}</span><span><b>الإصدارات</b>${m.versions.map(escapeHTML).join(", ")}</span></div><a class="btn btn-primary" href="${escapeHTML(m.download)}" target="_blank" rel="noopener">📥 صفحة التحميل</a><a class="btn btn-ghost" href="../mods.html">← العودة للمودات</a></div></div>`
}

function initAdmin(){
 const tabs=document.querySelectorAll(".tab");tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".admin-panel").forEach(x=>x.classList.add("hidden"));document.getElementById(t.dataset.tab).classList.remove("hidden")});
 const mf=document.getElementById("modForm"),mapf=document.getElementById("mapForm");
 function resetMod(){mf.reset();document.getElementById("modId").value=""}
 function resetMap(){mapf.reset();document.getElementById("mapId").value=""}
 function draw(){
  document.getElementById("adminModsList").innerHTML=mods().map(m=>`<div class="admin-item"><img src="${escapeHTML(m.image)}"><div><b>${escapeHTML(m.name)}</b><small>${escapeHTML(m.versions.join(", "))} · ${escapeHTML(m.category)}</small></div><button class="btn btn-small" onclick="editMod('${m.id}')">تعديل</button><button class="btn danger" onclick="deleteMod('${m.id}')">حذف</button></div>`).join("");
  document.getElementById("adminMapsList").innerHTML=maps().map(m=>`<div class="admin-item"><img src="${escapeHTML(m.image)}"><div><b>${escapeHTML(m.name)}</b><small>${escapeHTML(m.version)}</small></div><button class="btn btn-small" onclick="editMap('${m.id}')">تعديل</button><button class="btn danger" onclick="deleteMap('${m.id}')">حذف</button></div>`).join("");
 }
 mf.onsubmit=e=>{e.preventDefault();let a=mods(),id=document.getElementById("modId").value||crypto.randomUUID();let item={id,name:modName.value.trim(),description:modDescription.value.trim(),image:modImage.value.trim(),versions:modVersions.value.split(",").map(x=>x.trim()).filter(Boolean),loaders:modLoaders.value.split(",").map(x=>x.trim()).filter(Boolean),category:modCategory.value.trim(),download:modDownload.value.trim()};let i=a.findIndex(x=>x.id===id);i>=0?a[i]=item:a.push(item);setData("mh_mods",a);resetMod();draw();alert("تم حفظ المود");}
 mapf.onsubmit=e=>{e.preventDefault();let a=maps(),id=document.getElementById("mapId").value||crypto.randomUUID();let item={id,name:mapName.value.trim(),description:mapDescription.value.trim(),image:mapImage.value.trim(),version:mapVersion.value.trim(),download:mapDownload.value.trim()};let i=a.findIndex(x=>x.id===id);i>=0?a[i]=item:a.push(item);setData("mh_maps",a);resetMap();draw();alert("تم حفظ الخريطة");}
 document.getElementById("cancelEdit").onclick=resetMod;document.getElementById("cancelMapEdit").onclick=resetMap;
 document.getElementById("resetData").onclick=()=>{if(confirm("هل تريد حذف كل التعديلات المحلية؟")){localStorage.removeItem("mh_mods");localStorage.removeItem("mh_maps");location.reload()}}
 draw();
}
function editMod(id){const m=mods().find(x=>x.id===id);if(!m)return;modId.value=m.id;modName.value=m.name;modDescription.value=m.description;modImage.value=m.image;modVersions.value=m.versions.join(",");modLoaders.value=m.loaders.join(",");modCategory.value=m.category;modDownload.value=m.download;window.scrollTo({top:0,behavior:"smooth"})}
function deleteMod(id){if(confirm("حذف المود؟")){setData("mh_mods",mods().filter(x=>x.id!==id));initAdmin()}}
function editMap(id){const m=maps().find(x=>x.id===id);if(!m)return;mapId.value=m.id;mapName.value=m.name;mapDescription.value=m.description;mapImage.value=m.image;mapVersion.value=m.version;mapDownload.value=m.download;window.scrollTo({top:0,behavior:"smooth"})}
function deleteMap(id){if(confirm("حذف الخريطة؟")){setData("mh_maps",maps().filter(x=>x.id!==id));initAdmin()}}
