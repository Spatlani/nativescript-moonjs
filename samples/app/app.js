const Moon = require('./nativescript-moonjs')

const app = new Moon({
  template: `
    <Page>
        <Label text="hello"></Label>
    </Page>
  `
})

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
app.$start()