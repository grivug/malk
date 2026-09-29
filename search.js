async function searchMods() {
    const query = document.getElementById("searchInput").value.trim();
    const version = document.getElementById("version").value;
    const loader = document.getElementById("loader").value;
    const container = document.getElementById("resultsContainer");

    if (!query) {
        container.innerHTML = `
            <div class="empty">
                ⚠️ اكتب اسم المود أولًا
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="empty">
            ⏳ جاري البحث عن "${escapeHtml(query)}"...
        </div>
    `;

    try {
        const params = new URLSearchParams({
            q: query
        });

        if (version) {
            params.set("version", version);
        }

        if (loader) {
            params.set("loader", loader);
        }

        // نفس السيرفر الذي يعرض الموقع
        const response = await fetch(
            `/api/search/mods?${params.toString()}`
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(
                `السيرفر أرسل ردًا غير صحيح: ${text.slice(0, 200)}`
            );
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        displayMods(data.hits || []);

    } catch (error) {
        console.error("Search error:", error);

        container.innerHTML = `
            <div class="empty">
                ❌ حدث خطأ أثناء البحث
                <br><br>
                <small>${escapeHtml(error.message)}</small>
            </div>
        `;
    }
}


function displayMods(mods) {
    const container = document.getElementById("resultsContainer");

    if (!mods.length) {
        container.innerHTML = `
            <div class="empty">
                😕 لم نجد مودات بهذا الاسم
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    mods.forEach(mod => {
        const card = document.createElement("article");
        card.className = "card";

        const image =
            mod.icon_url ||
            "https://placehold.co/600x400?text=Minecraft+Mod";

        const description =
            mod.description ||
            "لا يوجد وصف للمود.";

        const downloads =
            Number(mod.downloads || 0).toLocaleString();

        const projectUrl =
            `https://modrinth.com/mod/${encodeURIComponent(mod.slug)}`;

        card.innerHTML = `
            <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(mod.title)}"
            >

            <div class="card-content">

                <h3>${escapeHtml(mod.title)}</h3>

                <p class="description">
                    ${escapeHtml(description)}
                </p>

                <div class="info">
                    <span>⬇️ ${downloads}</span>
                    <span>🧩 Mod</span>
                </div>

                <a
                    class="details"
                    href="${projectUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    عرض التفاصيل
                </a>

            </div>
        `;

        container.appendChild(card);
    });
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}


document
    .getElementById("searchInput")
    .addEventListener("keydown", event => {
        if (event.key === "Enter") {
            searchMods();
        }
    });