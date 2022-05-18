
export default class Fetcher {
  constructor(token) {
    this.token = token;
  }

  async get(api) {
    let res = await fetch(api,{
      method:"GET",
      headers: new Headers({"Content-Type": "application/json","Token": this.token}),
    });
    if(res.status === 200){
      return await res.json();
    }
  };

  async put(api,data) {
    return await fetch(api,{
      method:"PUT",
      headers: new Headers({"Content-Type": "application/json","Token": this.token}),
      body: JSON.stringify(data),
    });
  };

  async patch(api,data) {
    return await fetch(api,{
      method:"PATCH",
      headers: new Headers({"Content-Type": "application/json","Token": this.token}),
      body: JSON.stringify(data),
    });
  };

  async post(api,data) {
    if (data instanceof FormData) {
      return await fetch(api,{
        method:"POST",
        headers: new Headers({"Token": this.token}),
        body: data,
      });
    } else {
      return await fetch(api,{
        method:"POST",
        headers: new Headers({"Content-Type": "application/json","Token": this.token}),
        body: JSON.stringify(data),
      });
    }
  };

  async delete(api) {
    return await fetch(api,{
      method:"DELETE",
      headers: new Headers({"Content-Type": "application/json","Token": this.token}),
    });
  };
}


