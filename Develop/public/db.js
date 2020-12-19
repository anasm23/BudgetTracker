// request db
const request = indexedDB.open("budgetdb", 1);

const objectStore = db.createObjectStore("budgetdb");
objectStore.createIndex("budgetdb", "Transactions", "Amount");

request.onsuccess = event => {
  console.log(request.result);
}; 

request.onerror = event => console.error(event);

function checkDatabase() {
  const db = request.result;
  let transaction = db.transaction('readwrite');
  let store = transaction.objectStore();

  const keepall = store.keepall();
  keepall.onsucess = () => {
    if (keepall.result.length > 0) {
      fetch('/api/') , {
        method: 'Post',
        body: Json.stringify(keepall.result),
      }
    }
  }
}

//check
console.log("Hi from your service-worker.js file!");