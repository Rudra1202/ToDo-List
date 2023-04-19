const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const ItemsSchema = ({
    name: String
})

const Item = mongoose.model("Item", ItemsSchema);

const item1 = new Item({
    name: "Coding"
})
const item2 = new Item({
    name: "Developing"
})
const item3 = new Item({
    name: "CP"
})

const defaultitem = [item1, item2, item3];

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-us", options);
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultitem, function (err) {
                if (err) console.log(err);
                else console.log("Your Items are inserted");
                res.redirect("/");
            })
        } else
            res.render("list", { kindofday: day, newlistItems: foundItems });
    })
})

app.post("/delete", function (req, res) {
    const checkItems = req.body.checkbox;
    Item.findByIdAndRemove(checkItems, function (err) { 
        if (err) console.log(err);
        else console.log("Your Item are delted");
        res.redirect("/");
    })
})
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const item_Add = new Item({
        name: itemName
    })
    item_Add.save();
    res.redirect("/");
})

app.listen(1000);