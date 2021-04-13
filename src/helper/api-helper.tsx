export default class ApiHelper {
  /**
   * GetSuperHeroImageUrl will retrieve the super hero image from custom API
   */
  public static async GetSuperHeroImageUrl(superheroName: string): Promise<string> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "https://powermaverick.crm.dynamics.com");
    headers.append("Access-Control-Allow-Credentials", "true");

    let raw = JSON.stringify({
      name: superheroName,
    });

    let requestOptions: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    let shData = await fetch("https://maverick-superheros.azurewebsites.net/superhero", requestOptions);
    let shJsonData = await shData.json();

    return shJsonData.url;
  }
}
