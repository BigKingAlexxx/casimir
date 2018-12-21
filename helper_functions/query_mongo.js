'use strict';
const logic = require('../helper_functions/logic');
const koeln = require('../helper_functions/koeln');
const similarity = require('string-similarity');
const phonem = require('talisman/phonetics/german/phonem');
const Promise = require('promise');
const MongoClient = require('mongodb').MongoClient;
const urlOnline = { connectionString: "mongodb://admin:Software1@18.203.81.194:27017/admin", options: { useNewUrlParser: true } };

function queryInfoEmployee(firstName, lastName, object) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection('Employees').find({ cologne: { first: koeln(firstName), last: koeln(lastName) } }, { projection: { _id: 0 } }).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    let speechText = '';
                    let returnObject = { result: result, speechText: speechText, many: false };
                    if (result.length == 0 || isEmpty(result[0])) {
                        client.close();
                        returnObject.speechText = `Es tut mir leid, zu ${firstName} ${lastName} habe ich keine Informationen gefunden.`;
                        resolve(returnObject);

                    } else if (result.length > 1) {
                        speechText = `Unter diesem Namen habe ich mehrere Personen gefunden. Meinst du:`;
                        for (let i = 0; i < result.length; i++) {
                            speechText += ` <say-as interpret-as='digits'>${i + 1}</say-as>: ${result[i].firstName} ${result[i].lastName}.`
                        }
                        speechText += ' Bitte wähle die zutreffende Zahl.'
                        returnObject.speechText = speechText;
                        returnObject.many = true;
                        client.close();
                        resolve(returnObject);

                    } else {
                        if (object === 'salary') {
                            speechText = getEmployeeSpeechText(object, result);
                            returnObject.speechText = speechText;
                            client.close();
                            resolve(returnObject);

                        } else if (object === 'phone') {
                            speechText = getEmployeeSpeechText(object, result);
                            returnObject.speechText = speechText;
                            client.close();
                            resolve(returnObject);

                        } else if (object === 'date of joining') {
                            speechText = getEmployeeSpeechText(object, result);
                            returnObject.speechText = speechText;
                            client.close();
                            resolve(returnObject);

                        } else if (object === 'email') {
                            speechText = getEmployeeSpeechText(object, result);
                            returnObject.speechText = speechText;
                            client.close();
                            resolve(returnObject);

                        } else {
                            speechText = getEmployeeSpeechText('allInfo', result);
                            console.log("Sprachtext: " + speechText);
                            returnObject.speechText = speechText;
                            client.close();
                            resolve(returnObject);
                        }
                    }
                });
            }
        });
    });
}

function queryAppointment(userId, date) {
    let query;
    if (date) query = date;
    else query = { $gte: logic.getDateString() };
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection('Appointments').find({ userId: userId, date: query }, { projection: { _id: 0, userId: 0 } }).toArray(function (err, result) {
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

function queryCustomersAggregate(number, ranking, customerFeature, startDate, endDate) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');

                if (number && ranking && customerFeature) {
                    console.log("alle drei")
                    db.collection('Customers').find({}, { projection: {} }).sort({ [customerFeature]: ranking }).limit(number).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            client.close();
                            resolve(result);
                        }
                    });
                } else if (!number && ranking && customerFeature) {
                    console.log("keine nummer")
                    db.collection('Customers').find({}, { projection: {} }).sort({ [customerFeature]: ranking }).limit(3).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            client.close();
                            resolve(result);
                        }
                    });
                } else if (!number && !ranking && customerFeature === 'glücklich') {
                    console.log("glücklich")
                    let satisfactionTerms = ['Fan', 'Sympathisant', 'Gefangener', 'Söldner', 'Gegner'];
                    let satisfactionValues = { 'Fan': 0, 'Sympathisant': 0, 'Gefangener': 0, 'Söldner': 0, 'Gegner': 0 };
                    let promises = [];

                    for (let i = 0; i < satisfactionTerms.length; i++) {
                        promises.push(new Promise((resolve, reject) => {
                            db.collection('Customers').countDocuments({ satisfaction: satisfactionTerms[i] }).then((response) => {
                                resolve({ [satisfactionTerms[i]]: response });
                            });
                        }));
                    }
                    client.close();
                    resolve(Promise.all(promises));
                } else if (startDate && endDate === '') {
                    db.collection('Customers').find({
                        $and: [{ customer_since: { $gte: startDate + '-01' } },
                            { customer_since: { $lte: startDate + '-' + logic.getDaysInMonth(startDate) } }]
                    }, { projection: {} }).sort({ customer_since: 1 }).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            client.close();
                            resolve(result);
                        }
                    });
                } else if (startDate, endDate) {
                    db.collection('Customers').find({
                        $and: [{ customer_since: { $gte: startDate + '-01' } },
                            { customer_since: { $lte: endDate + '-' + logic.getDaysInMonth(endDate) } }]
                    }, { projection: {} }).sort({ customer_since: 1 }).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            client.close();
                            resolve(result);
                        }
                    });
                } else {
                    client.close();
                    reject(new Error('MongoDB: no data found.'));
                }
            }
        });
    });
}

function queryAndUpdate(query, collection) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection(collection).findOneAndUpdate(query.find, query.set, function (err, result) {
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

function queryMongoDB(query, collection) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection(collection).find(query).toArray(function (err, result) {
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

function queryName(recValFirstName, recValLastName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                //db.collection('Names').find({ firstCologne: koeln(recValFirstName), lastCologne: koeln(recValLastName) }, { projection: {} }).toArray(function (err, result) {
                db.collection('Names').find({ phonem: { first: phonem(recValFirstName), last: phonem(recValLastName) } }, { projection: { _id: 0 } }).toArray(function (err, result) {
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

async function findNames(firstName, lastName) {
    let koelnFirst = koeln(firstName);
    let koelnLast = koeln(lastName); console.log(koelnLast);

    let regexFirst0 = koelnFirst;
    let regexLast0 = koelnLast;
    let regexFirst1 = "^" + koelnFirst + "$";
    let regexLast1 = "^" + koelnLast.substr(0, koelnLast.length - 1) + ".?$";
    let regexFirst2 = "^" + koelnFirst.substr(0, koelnFirst.length - 1) + ".?$";
    //let regexLast2 = "^" + koelnLast.substr(0, koelnLast.length - 1) + ".?$";
    if (koelnLast.length > 2) koelnLast = koelnLast.substr(0, koelnLast.length - koelnLast.length + 2);
    let regexLast2 = "[0-9]*" + koelnLast + "[0-9]*"; console.log(regexLast2)

    let query = { "cologne.first": { $regex: regexFirst0 }, "cologne.last": { $regex: regexLast0 } };
    let queryArray = [{ "cologne.first": { $regex: regexFirst0 }, "cologne.last": { $regex: regexLast0 } },
        { "cologne.first": { $regex: regexFirst1 }, "cologne.last": { $regex: regexLast1 } },
        { "cologne.first": { $regex: regexFirst2 }, "cologne.last": { $regex: regexLast2 } }];
    let result;
    console.log(JSON.stringify(queryArray))
    try {
        for (let i = 0; i < queryArray.length; i++) {
            result = await queryTest(queryArray[i]);
            if (result !== false && i === 2) {
                result.push({ queryLevel: i });

            }
        }
    } catch (error) {
        console.log(error);
    }
    return result;
}

function queryTest(query) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(urlOnline.connectionString, urlOnline.options, function (err, client) {
            if (err) reject(err);
            else {
                var db = client.db('TestDB');
                db.collection('Names').find(query, { projection: { _id: 0 } }).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else if (result.length == 0 || isEmpty(result[0])) {
                        client.close();
                        resolve(false);
                    } else {
                        client.close();
                        resolve(result);
                    }
                });
            }
        });
    });
}

async function findAll(name) {
    let results = [];

    try {
        let names = await queryTest({});
        for (let i of names) {
            if (similarity.compareTwoStrings(koeln(name), i.cologne.both) >= 0.8) results.push(i);
        }
    } catch (error) {
        console.log(error);
    }
    return results.length > 0 ? results : false;
}

module.exports = {
    queryInfoEmployee,
    queryAppointment,
    queryCustomersAggregate,
    queryAndUpdate,
    queryMongoDB,
    queryName,
    findNames,
    queryTest,
    findAll
}