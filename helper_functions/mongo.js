'use strict';
const Promise = require('promise');
const MongoClient = require('mongodb').MongoClient;
const urlOnline = {
    connectionString: "mongodb://admin:Software1@18.203.81.194:27017/admin",
    options: {useNewUrlParser: true}
};

function findInMongo(field, document, collectionName) {
    return MongoClient.connect(urlOnline.connectionString, urlOnline.options).then(function (client) {
        var db = client.db('TestDB');
        var data = db.collection(collectionName).find({[field]: new RegExp('^' + document + '$', "i")}, {projection: {_id: 0}}).toArray();
        client.close();
        return data;
    }).then(function (items) {
        return items[0];
    });
}

function testFunction(projectName, notes) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection('Projects').find({name: "Bachelor-Thesis"}, {projection: {}}).toArray(function (err, result) {
                    if (err) throw err;
                    else {
                        db.collection('Projects').updateOne({name: result[0].name}, {$set: {notes: result[0].notes + notes}}, function (err, result) {
                            client.close();
                            resolve(result);
                        });
                    }
                });
            }
        });
    });
}

//testFunction('Bachelor-Thesis', ' Die Thesis wird bombe.').then(console.log()).catch(console.error);

module.exports = {
}

/* function myPromise() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                await db.collection('Customers').updateMany(
                    { satisfaction: { $lt: 50 } },
                    {
                        $set: { 'size.uom': 'in', status: 'P' },
                        $currentDate: { lastModified: true }
                    }
                );
            }
        });
    });
} */
const customers = ["Hauffer GbR",
    "Hartmann",
    "Bohlander Rosenow GmbH & Co. KG",
    "Ziegert",
    "Stadelmann GmbH & Co. KGaA",
    "Weihmann",
    "Henschel",
    "Juncken Stey AG",
    "Heydrich Metz GmbH & Co. KG",
    "Austermühle Täsche GmbH & Co. KGaA",
    "Gehringer Hornich GmbH",
    "Hartmann",
    "Rose GmbH & Co. KGaA",
    "Wulff Jopich Stiftung & Co. KG",
    "Ditschlerin GmbH",
    "Jüttner Seip e.G.",
    "Sölzer GmbH",
    "Knappe KG",
    "Lindner GmbH",
    "Biggen Stolze GmbH & Co. KG",
    "Steckel GbR",
    "Bolander GmbH & Co. KGaA",
    "Mende Tröst GmbH & Co. OHG",
    "Ehlert AG",
    "Mude GmbH & Co. OHG",
    "Stiebitz Döhn GmbH",
    "Naser GbR",
    "Schottin Seidel AG",
    "Zorbach AG & Co. KG",
    "Dobes Stiffel e.G.",
    "Striebitz Budig AG & Co. OHG",
    "Carsten",
    "Seifert Käster GmbH & Co. KG",
    "Wilms Lehmann Stiftung & Co. KG",
    "Wohlgemut",
    "Geisel",
    "Trüb Geisel KG",
    "Mitschke AG",
    "Fritsch",
    "Röhricht Segebahn GmbH",
    "Rogge Thanel e.V.",
    "Haase e.G.",
    "Kraushaar",
    "Holt KG",
    "Bohnbach Vogt AG",
    "Mielcarek",
    "Krebs Trubin GmbH",
    "Dörr Sontag AG",
    "Kostolzin GmbH",
    "Wagenknecht AG",
    "Stiebitz Otto KG",
    "Sorgatz Langern GmbH & Co. OHG",
    "Wähner Hahn KG",
    "Gumprich Holzapfel GbR",
    "Kambs",
    "Hoffmann GmbH & Co. KG",
    "Gotthard",
    "Bender KG",
    "Briemer Stolze GbR",
    "Paffrath GmbH & Co. KG",
    "Hentschel Ladeck e.G.",
    "Weimer Pärtzelt GmbH & Co. KG",
    "Stumpf GmbH & Co. KGaA",
    "Dehmel AG",
    "Kuhl Bärer Stiftung & Co. KGaA",
    "Flantz AG & Co. KG",
    "Lindau Mans e.V.",
    "Gumprich Wulf GbR",
    "Stey GmbH",
    "Striebitz",
    "Scholz",
    "Tintzmann",
    "Koch Rosenow GbR",
    "Otto Gude Stiftung & Co. KGaA",
    "Preiß",
    "Mentzel Zahn KG",
    "Klotz e.V.",
    "Mies AG & Co. KGaA",
    "Schleich",
    "Junitz e.V.",
    "Speer",
    "Hering GmbH",
    "Mans",
    "Jüttner Weitzel GmbH",
    "Rohleder",
    "Mentzel GmbH & Co. KGaA",
    "Gertz Schinke AG",
    "Stey AG",
    "Nohlmans Stiftung & Co. KGaA",
    "Kraushaar Ebert Stiftung & Co. KG",
    "Girschner AG & Co. OHG",
    "Schweitzer",
    "Schlosser Klapp GmbH",
    "Eberth",
    "Dörr AG",
    "Rose Gertz GmbH",
    "Otto",
    "Nette",
    "Seifert Barth AG",
    "Hein Trommler OHG mbH"];

function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const fs = require('fs');

/* for (let i = 0; i < customers.length; i++) {
    var output = customers[i].substring(1, customers[i].length - 1)
    fs.appendFile('opportunities.txt', customers[i] + ',\n', function (err) {
        if (err)
            return console.log(err);
    });
} */


// Kundenname
// number of licences
// probability
// volume of orders
// weighted value

/* var data = [];

for (let i = 0; i < 100; i++) {
    var decimal = require('mongodb').Decimal128;
    var probability = randomIntFromInterval(10, 100);
    var units = randomIntFromInterval(1, 1000);
    var unitCost = randomIntFromInterval(500, 1500);
    console.log(units + " * " + unitCost + " = " + units * unitCost)
    var value = units * unitCost;
    console.log(customers[i] + ": " + value)
    data.push({
        name: customers[i], licences: {units: units, unit_cost: unitCost, currency: "EUR"}, probability: probability,
        volume_of_orders: { value: value, currency: "EUR" }, weighted_value: {value: new mongo.Double(((probability / 100) * value).toFixed(2)), currency: "EUR"}
    });
}

insertIntoMongo(data, "Opportunities") */

/*
function queryName(recValFirstName, recValLastName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection('Customers').find({}, { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            fs.appendFile('opportunities.txt', JSON.stringify(result[i].name) + ',\n', function (err) {
                                if (err)
                                    return console.log(err);
                            });
                        }

                        client.close();
                        resolve(result);
                    }
                });
            }
        });
    });
}

queryName().then(console.log).catch(console.error); */


/* async function printAll() {
    let newResult = [{cologne: {first: '', last: ''}, phonem: {first: '', last: ''}, firstName: '', lastName: ''}];
    let result = await queryName();
    for (i of result) {
        newResult.push({cologne: {first: i.firstCologne, last: i.lastCologne}, phonem: {first: phonem(i.firstName), last: phonem(i.lastName)}, firstName: i.firstName, lastName: i.lastName});
    }
    insertIntoMongo(newResult, 'Names');
}

printAll(); */


/* function query(query, collection) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection(collection).findOneAndUpdate(query.find, query.set, { returnOriginal: false }, function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        client.close();
                        resolve(result);
                    }
                });
            }
        });
    });
}

let project = {
    "name": "", "project_manager": "", "customer_name": "", "customer_contact": { "name": "", "phone": "", "email": "" },
    "start": "", "end": "", "budget": { "total": { "$numberInt": "0" }, "left": { "$numberInt": "0" }, "currency": "EUR" },
    "department": "", "number_of_employees": { "$numberInt": "0" }, "notes": ""
}

let query1 = { find: { name: "Thesis" }, set: { $set: { number_of_employees: 3 } } };

query(query1, 'Projects')
    .then((msg) => {
        console.log(JSON.stringify(msg.value));
    }).catch(console.error);



 */