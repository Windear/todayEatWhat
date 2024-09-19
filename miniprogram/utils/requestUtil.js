const baseUrl = 'http://192.168.31.201:8888'
 
export const getBaseUrl = ()=>{
    return baseUrl;
}
 

// 后端request请求工具类
export const requestUtil = (params)=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (res)=>{
                resolve(res)
            },
            fail: (err)=>{
                reject(err)
            }
        })
    });
}
