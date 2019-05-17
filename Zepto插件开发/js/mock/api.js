// 查询函数转换
function JsonData(data) {
    var t = {}
    var arr = data.split('&');
    for (var i = 0; i < arr.length; i++) {
        t[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    return t
}


// 模拟数据库数据
var count = 100
var list = [{"id":"EFd09b17-8d29-78f6-8fC0-e4C7fFF67DD5","name":"江杰","age":86,"address":"聊城市"},{"id":"A4e3aefA-ee0c-d21F-5F48-FC2C0dACc22b","name":"毛超","age":14,"address":"重庆市"},{"id":"Cb14aCD4-c98b-2F22-337A-EAAfD6d868db","name":"钱军","age":70,"address":"天津市"},{"id":"c8f9bBb4-d5d5-74da-b358-16f282e9736B","name":"冯洋","age":22,"address":"宝鸡市"},{"id":"553e8CD2-FB43-365A-21EC-3dcdbBA3De53","name":"钱伟","age":24,"address":"新竹市"},{"id":"52BFf927-daA1-24aD-27Cb-Bf3fEd17c8DF","name":"汪磊","age":76,"address":"日喀则地区"},{"id":"B32Aa92A-dBAD-12a8-7F61-02cdBC3f880F","name":"黄超","age":81,"address":"上海市"},{"id":"DFADD6e4-ba77-5Bb9-AAcF-1CAFE9e4e0Ef","name":"杜娜","age":34,"address":"锦州市"},{"id":"d277ECc3-B1cB-e259-A9dF-578fA5AfB6C3","name":"萧杰","age":20,"address":"阜阳市"},{"id":"a7dFe315-2787-7e73-fb8C-b672FCE1dbcf","name":"何静","age":40,"address":"怀化市"},{"id":"4Ac5CFFF-261B-C85f-F54A-c5fE130995cE","name":"郝娜","age":83,"address":"离岛"},{"id":"baB4d2f5-53F3-FA15-bBF3-D2b9A6B2d0Ae","name":"袁杰","age":21,"address":"孝感市"},{"id":"E7E5EBf1-315D-83fb-c82f-Cd2740cCecdd","name":"阎艳","age":57,"address":"银川市"},{"id":"FFA637Dd-EFfC-BfEF-747b-e1dFE1CAC0dA","name":"常杰","age":90,"address":"香港岛"},{"id":"fDBA297b-d48C-e66f-1c1F-bC9AeE70E36D","name":"黄丽","age":33,"address":"九江市"},{"id":"FB121Cbb-d3b5-D3FD-638A-B5f811cBA891","name":"钱丽","age":84,"address":"南平市"},{"id":"4BC6C792-3Ff0-35D5-cC74-FC8DA19C1ad2","name":"乔平","age":51,"address":"枣庄市"},{"id":"c33eb8d9-f699-eb7E-511f-b9F6c4C2E47b","name":"黄秀兰","age":75,"address":"红河哈尼族彝族自治州"},{"id":"Fefe9c36-4932-1fFB-5fcf-Ac6BbE1F2dB6","name":"方磊","age":19,"address":"丽水市"},{"id":"31Ddd739-3C8b-9fDd-2C6B-CA1f21cAC4dF","name":"龚杰","age":100,"address":"咸阳市"},{"id":"aBDDcEa9-a7cc-f33c-94C6-e9d7AfB6f7AC","name":"陆娜","age":35,"address":"克拉玛依市"},{"id":"8dDDBD4f-3eCb-d534-cDec-672c3685fD2f","name":"魏伟","age":11,"address":"白城市"},{"id":"f3f4Eafe-1dD2-2395-aDce-4DAC3Ba64AcD","name":"宋平","age":33,"address":"固原市"},{"id":"9aAbc47c-8F39-9635-d0dd-c33021f8d637","name":"任丽","age":7,"address":"南平市"},{"id":"A1d790Ed-682e-c88D-4dFB-Eb18EF2B92cE","name":"万洋","age":58,"address":"宜昌市"},{"id":"0Ef54e3E-25e1-FcBf-793b-498ff1F48Ddc","name":"邓平","age":90,"address":"铜仁市"},{"id":"DFfDEaB8-Ebad-bfE4-BB8a-63A0baCef115","name":"谢秀英","age":27,"address":"三亚市"},{"id":"bFcF72E2-cdC4-7953-D9bF-Dd2e38E7BED3","name":"潘刚","age":59,"address":"天津市"},{"id":"E7A36Ccb-ebfE-17bf-d422-fFd2DBF6D1E5","name":"张娟","age":14,"address":"鞍山市"},{"id":"cdD2F535-10fC-D5Bc-bcE9-c0DAf19812f5","name":"马平","age":54,"address":"洛阳市"},{"id":"7d3C9De9-7fCe-C33c-1CD6-C3a13E93BBCF","name":"谢洋","age":78,"address":"南阳市"},{"id":"B3ce5CF5-dB6F-84f3-fbbf-d528AD202AF2","name":"邓勇","age":43,"address":"香港岛"},{"id":"F6786f0E-15a1-3f6e-FADe-E2E73CB5Ac9F","name":"石刚","age":81,"address":"张掖市"},{"id":"85FeeeDb-9A2D-4cD0-A322-ED29442D405f","name":"董芳","age":33,"address":"天津市"},{"id":"4ECe118c-31bf-AE3d-d153-22791cBB15b8","name":"康敏","age":74,"address":"邵阳市"},{"id":"9CA2F8AB-4c36-badf-F0E2-1e3Fa66141CC","name":"吴超","age":73,"address":"枣庄市"},{"id":"Dcc63DFF-BF6D-74FA-E7BC-8681a89eEdEB","name":"刘杰","age":78,"address":"金门县"},{"id":"6E7228ef-DE9A-Cb5B-52f8-AfceDBfB4AFE","name":"乔静","age":38,"address":"淮安市"},{"id":"DD7Ab3Ca-35DA-Bf8c-B9B5-5E2FfDeffd84","name":"任勇","age":42,"address":"阿克苏地区"},{"id":"bC4fBC20-0d13-fF1b-eAB3-6BD83AD9FB64","name":"郑杰","age":89,"address":"雅安市"},{"id":"C5E8D6aD-74bE-0Db9-13Db-987cE7EdFAaA","name":"黄艳","age":19,"address":"庆阳市"},{"id":"f76bEffA-470e-BD25-7975-64d86C42Bb7B","name":"蔡丽","age":69,"address":"天津市"},{"id":"f3fFf6dA-f47A-A324-641d-bE2DEb7d30Be","name":"程静","age":60,"address":"新乡市"},{"id":"EF29B14c-EA28-B5Ce-DdFe-BDC4b9D1ddeF","name":"薛涛","age":69,"address":"湖州市"},{"id":"AAA6FFFB-c3cc-bc8a-625F-D3eBAb9a6216","name":"徐丽","age":32,"address":"包头市"},{"id":"EaECC6E1-692F-14E9-db99-72aD9F1AECCb","name":"杜杰","age":35,"address":"石嘴山市"},{"id":"B0b225B3-3bf0-CBf3-cD95-CaAB328Cc9Cd","name":"卢磊","age":85,"address":"咸宁市"},{"id":"cf31AdEB-5F1D-86DB-81fe-66cBfD0cEfE4","name":"薛刚","age":61,"address":"运城市"},{"id":"c7c1df7C-F893-A986-bD6A-ed6137ed7C2F","name":"曹敏","age":50,"address":"海外"},{"id":"CC07457b-BEA7-D1cA-6dEa-44FcebeEEc2c","name":"戴刚","age":94,"address":"重庆市"},{"id":"4dCDC2AC-8b2B-92d6-22EE-142c1b89A6d2","name":"沈明","age":93,"address":"抚顺市"},{"id":"E3f1cd74-0cFa-F0f1-BBD3-E016fF3CEc78","name":"方勇","age":50,"address":"营口市"},{"id":"74F2bB6D-10dB-fF5F-56bd-e995e0bDF826","name":"刘娟","age":80,"address":"赤峰市"},{"id":"6Bf2fc6F-bdE3-76DE-57bC-cB01C66f5B6A","name":"冯娜","age":73,"address":"海外"},{"id":"Bb52d3d5-5bfF-9D7B-4ED5-B13EEb2F5FAD","name":"姚娜","age":87,"address":"中卫市"},{"id":"0f6d8917-5ED2-A965-bf77-DCd7aD17e11f","name":"邵艳","age":97,"address":"汉中市"},{"id":"DCE49ce6-7911-54eF-9bec-DAebBAE4bfaA","name":"于涛","age":86,"address":"宜兰县"},{"id":"eaE1c3B7-6Aa6-E3Bc-828d-8FBEA33EEeCf","name":"马平","age":94,"address":"毕节市"},{"id":"8edCdCb4-4A7F-ddfB-5d57-46DB5CCfBb4B","name":"侯杰","age":27,"address":"昌吉回族自治州"},{"id":"7e0fb7Af-74cA-afec-FEe6-883cc26a0515","name":"乔霞","age":58,"address":"昌都地区"},{"id":"cE14ECb4-bB5a-bc56-f9F4-8F2256ABA7d3","name":"董静","age":37,"address":"阳泉市"},{"id":"719A3ACE-F41d-e449-FE5f-CeeA811Eb4fa","name":"郝敏","age":24,"address":"泰州市"},{"id":"b613c3Fb-e4F8-e5C7-73c4-8bAEcef1ABfB","name":"孟霞","age":52,"address":"天津市"},{"id":"256FC867-F2a5-1ADE-1FeD-eBB94095188B","name":"冯明","age":37,"address":"吉林市"},{"id":"53491ae8-EA70-6E8c-5CBC-d2C00A72bCBe","name":"胡洋","age":47,"address":"十堰市"},{"id":"E82E43B1-9a26-5d5A-cEbd-1eF8Db5Fb5ee","name":"钱勇","age":22,"address":"聊城市"},{"id":"24D2FFB4-C42f-F523-71f4-85df47Df7AA1","name":"方平","age":94,"address":"苗栗县"},{"id":"fAa465ac-81bF-ea5c-fAFC-427e45998Bdb","name":"熊刚","age":61,"address":"长沙市"},{"id":"7eE6e5Ee-d0C1-134C-DdD6-4f3d2DB735FF","name":"曹芳","age":86,"address":"澳门半岛"},{"id":"F52b778F-45fc-C8bf-f6d6-fFffF1c4BE4e","name":"范桂英","age":41,"address":"黄石市"},{"id":"8dA6AF85-3477-a6f7-222d-f6FCfB1c71cc","name":"曹磊","age":54,"address":"白银市"},{"id":"16e7F293-E222-79AF-C31D-91d6c277DE35","name":"段超","age":36,"address":"廊坊市"},{"id":"9eAaeDcE-e26d-58cB-acD4-3FCC73BF0D3B","name":"罗杰","age":37,"address":"湛江市"},{"id":"ec9Dca6b-BB5b-d733-EAee-F9422B8d97c1","name":"孟杰","age":81,"address":"运城市"},{"id":"dACA6D4c-dc7c-102f-2729-0FDFbBBfdEbE","name":"孟磊","age":71,"address":"铜川市"},{"id":"3fcA898c-e956-54a1-5F38-Ee9Ce23cAbDD","name":"曾勇","age":61,"address":"六盘水市"},{"id":"e4cfE5E0-32d0-72FD-9759-AbED9EFbc135","name":"易秀兰","age":93,"address":"泰州市"},{"id":"3c4bcDD3-Df7E-86Eb-735b-CfEB6B4bABDc","name":"万敏","age":34,"address":"邢台市"},{"id":"bEEfe3BF-Baa4-ef52-f2bB-eC3eF2FFBD34","name":"郭磊","age":74,"address":"池州市"},{"id":"81bce7D1-fB3d-Ee35-87eE-86aDEFc8ac2C","name":"汤军","age":74,"address":"吉林市"},{"id":"97d5fBe8-40fB-23AE-eD87-5A866275ac4E","name":"萧军","age":16,"address":"阳泉市"},{"id":"d0d228A3-6d6d-eA4C-dfE6-fE7d5Eae53a2","name":"毛涛","age":42,"address":"三亚市"},{"id":"B74AADC5-Ed3E-4ABa-E1c2-d9491aCfeceA","name":"范秀兰","age":83,"address":"盐城市"},{"id":"6Cad5926-5147-d1DA-1Ae0-6CD48802ce4f","name":"易静","age":95,"address":"崇左市"},{"id":"D33dEe75-BF5f-2A2a-e9ad-cB42c39b91B5","name":"冯强","age":4,"address":"南平市"},{"id":"BA42Ceba-e4BE-7ced-dB4F-6E3f99CF9d95","name":"邵平","age":41,"address":"天津市"},{"id":"E32efc75-876d-9c28-f7c3-9dcD2bC0BF35","name":"邱勇","age":23,"address":"九龙"},{"id":"0D984213-7d8F-B6c3-534B-657C3E7CAFbF","name":"沈桂英","age":56,"address":"盐城市"},{"id":"dAde5b7f-3aBA-4461-0B6F-BfD34a19ECe8","name":"赖平","age":20,"address":"内江市"},{"id":"96a87eCB-7c4d-3eef-951B-8fcfA21DF60c","name":"苏明","age":36,"address":"海外"},{"id":"E4bF0ccA-C25c-AC5F-63CA-BdbbeafD85cF","name":"易刚","age":41,"address":"上海市"},{"id":"6B682dcA-852d-6a0E-eC14-6BA3d22b4faa","name":"孟明","age":96,"address":"三沙市"},{"id":"9F96b5Ef-Fec2-4428-d456-a30B966C6cD9","name":"姜明","age":35,"address":"泸州市"},{"id":"cE4dc2aE-FC3B-84dD-95FA-7D5275aEbe6b","name":"许芳","age":38,"address":"泉州市"},{"id":"4df66F7e-3752-F3F9-D5Ad-4b77bC4191B0","name":"叶丽","age":40,"address":"衡水市"},{"id":"2Eb3e6Da-961C-d90B-397C-9cE5FEefeC72","name":"谢桂英","age":34,"address":"重庆市"},{"id":"8ab2Eda2-B19b-6D6B-B75D-93B7E3eBae8d","name":"顾平","age":77,"address":"克孜勒苏柯尔克孜自治州"},{"id":"2FAC15E5-6eE0-d674-3668-798da4e8EB09","name":"胡静","age":98,"address":"晋城市"},{"id":"31CC9724-7E9f-cBc9-029B-e93d6cbef38F","name":"余磊","age":99,"address":"深圳市"},{"id":"bf2DE453-2E63-11f4-76BE-75ceCACa1be5","name":"沈军","age":47,"address":"上海市"}];
// for(var i = 0; i < count; i++){
//    list.push(Mock.mock({
//        id:'@guid',
//        name:'@cname',
//        'age|1-100':0,
//        address:'@city'
//    }))
// }

// 数据拼装
let data = {
    code: 1,
    message: 'success',
    data: {
        rows: [],
        total: count
    },
}
// 分页 
Mock.mock(/api\/test/, 'get', function (req, res) {
    var query = JsonData(req.body);
    var limit = Number(query.limit)
    var offset = Number(query.offset)
    var newList = list.slice((offset - 1) * limit, offset * limit)
    data.data.rows = newList
    return data
})
// 查询
Mock.mock(/api\/test\/[a-zA-Z0-9_-]+$/, 'post', function (req, res) {
    var params = req.url.replace(/\/api\/test\//,'');
    var newList = list.filter(item=>{
        return item.id == params
    })
    data.data=newList
    return data
})
// 编辑查询
Mock.mock(/api\/test\/.*\/edit?$/, 'post', function (req, res) {
    var params = req.url.replace(/\/api\/test\//,'').replace(/\/edit/,'');
    console.log(params)
    var newList = list.filter(item=>{
        return item.id == params
    })
    data.data=newList
    return data
})
Mock.mock('/api/1','get',function(){
    return Mock.mock({
        'data|100':[{
            name:'@cname',
            'age|1-100':0,
            address:'@city'
        }]
    })
})




// 更新

// 删除

// 新增