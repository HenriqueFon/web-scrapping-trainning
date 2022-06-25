const puppeteer = require('puppeteer');

const results=[];
//Essa chamada cria uma função e logo depois a executa
(async () => {
    //headless=false, mostra para gnt o processo que o puppeteer faz no chromium
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://www.mercadolivre.com.br/');
  //await page.screenshot({path: 'print.png'});//--> tira uma screenshot de toda a página

  //espero elemento renderizar
  await page.waitForSelector('#cb1-edit');
  
  //pego o id da navbar que desejo usar
  const element=await page.$('#cb1-edit');
  element.type("Placa de Video");

  await page.waitForTimeout(4000);
  
  //espera que essas promessas sejam cumpridas
  await Promise.all([
    page.waitForNavigation(),
    page.click('.nav-icon-search')
  ])
  
  //dentro da class que traz os resultados do elemento que seria a tag html 
  // que carrega em baixo o "a" dos hrefs da imagem. criamos um el, e dentro dele iteramos
  const links=await page.$$eval('.ui-search-result__image > a',el=>el.map(link=>link.href));

  for(const link of links){
    await page.goto(link);
    await page.waitForSelector('.ui-pdp-title');
    //$ 1 cifrão no eval retorna apenas um valor
    const title=await page.$eval('.ui-pdp-title',element=>element.innerHTML);
    const price=await page.$eval('.andes-money-amount__fraction',element=>element.innerHTML);

    //seller nem sempre vai existir, por isso
    const seller=await page.evaluate(()=>{
        const el=document.querySelector('.ui-pdp-seller__link')
        if(!el) return null
        return el.innerHTML;
    })

    const obj={};
    obj.title=title;
    obj.price=price;
    //se seller existir seto ele como o valor da página seller
    (seller?obj.seller=seller:'');


    result.push(obj);
  }

  console.log(obj);
  //await browser.close();
})();//<-ponto em que a função recem criada foi executada