const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

const db = new Database("database.db");

app.use(cors());
app.use(express.json());


// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.send("Minecraft Hub is working! 🎮");
});


// ==========================
// عرض المودات من قاعدة البيانات
// ==========================
app.get("/api/mods", (req, res) => {

    const mods = db
        .prepare("SELECT * FROM mods ORDER BY id DESC")
        .all();

    res.json(mods);
});


// ==========================
// إضافة مود
// ==========================
app.post("/api/mods", (req, res) => {

    const {
        name,
        version,
        loader,
        image,
        download,
        description
    } = req.body;


    if (!name || !version || !loader) {

        return res.status(400).json({
            error: "name, version and loader are required"
        });

    }


    const result = db.prepare(`
        INSERT INTO mods
        (name, version, loader, image, download, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        name,
        version,
        loader,
        image || "",
        download || "",
        description || ""
    );


    res.json({
        message: "Mod added successfully!",
        id: result.lastInsertRowid
    });

});


// ==========================
// حذف مود
// ==========================
app.delete("/api/mods/:id", (req, res) => {

    const result = db
        .prepare("DELETE FROM mods WHERE id = ?")
        .run(req.params.id);


    res.json({
        message: "Mod deleted successfully!",
        deleted: result.changes
    });

});


// ==========================
// البحث عن المودات في Modrinth
// ==========================
app.get("/api/search/mods", async (req, res) => {

    try {

        const query = req.query.q || "";
        const version = req.query.version || "";
        const loader = req.query.loader || "";


        if (!query) {

            return res.status(400).json({
                error: "اكتب اسم المود الذي تريد البحث عنه"
            });

        }


        const facets = [
            ["project_type:mod"]
        ];


        if (version) {
            facets.push([
                `versions:${version}`
            ]);
        }


        if (loader) {
            facets.push([
                `categories:${loader}`
            ]);
        }


        const url =
            "https://api.modrinth.com/v2/search" +
            "?query=" +
            encodeURIComponent(query) +
            "&limit=20" +
            "&facets=" +
            encodeURIComponent(
                JSON.stringify(facets)
            );


        const response = await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Modrinth API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        res.json(data);

    }

    catch (error) {

        console.error(error);


        res.status(500).json({
            error: "حدث خطأ أثناء البحث في Modrinth"
        });

    }

});


// ==========================
// تشغيل السيرفر
// ==========================
app.listen(PORT, () => {

    console.log(
        `Minecraft Hub running at http://localhost:${PORT}`
    );

});
app.use(cors());
app.use(express.json());
app.use(express.static("F:/Minecraft Hup"));