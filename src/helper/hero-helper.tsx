import DataHelper from "./data-helper";

export default class HeroHelper {
  /**
   * GetAllHeros will retrieve data from Hero table in Dataverse
   */
  public static async GetAllHeros(): Promise<any[]> {
    const fetch = `<fetch>
                    <entity name="pmav_superhero" >
                      <attribute name="pmav_name" />
                      <attribute name="pmav_publisher" />
                      <attribute name="pmav_gender" />
                      <attribute name="pmav_gendername" />
                      <attribute name="pmav_heightcm" />
                      <attribute name="pmav_stats_strength" />
                      <attribute name="pmav_race" />
                      <attribute name="pmav_haircolor" />
                      <attribute name="pmav_eyecolor" />
                      <attribute name="pmav_stats_combat" />
                      <attribute name="pmav_alignmentname" />
                      <attribute name="pmav_stats_speed" />
                      <attribute name="pmav_stats_power" />
                      <attribute name="pmav_stats_durability" />
                      <attribute name="pmav_alignment" />
                      <attribute name="pmav_stats_intelligence" />
                    </entity>
                  </fetch>`;
    const response = await DataHelper.Fetch(fetch);
    return response;
  }
}
