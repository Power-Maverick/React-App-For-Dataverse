export default class DataHelper {
  /**
   * fetches the data from Dataverse based on provided FetchXML
   */
  public static Fetch(fetchXml: string): any[] {
    let values: any[] = [];

    var xmlParser = new DOMParser();
    var parsedFetchXml = xmlParser.parseFromString(fetchXml, "text/xml");
    var entityName = (parsedFetchXml.getElementsByTagName("entity")[0] as any).attributes["name"].value;

    var encodedFetchXml = encodeURIComponent(fetchXml);

    return this.GetXrmContext()
      .WebApi.retrieveMultipleRecords(entityName, "?fetchXml=" + encodedFetchXml)
      .then(
        (results: any) => {
          let formattedResults = this.FormatRecords(results.entities);
          values = values.concat(formattedResults);
          return values;
        },
        function (error: any) {
          // TODO
        },
      );
  }

  private static GetXrmContext() {
    if ((window as any).Xrm) {
      return (window as any).Xrm;
    } else if ((window as any).opener && (window as any).opener.Xrm) {
      // Ribbon button dialogs
      return (window as any).opener.Xrm;
    } else if ((window as any).parent && (window as any).parent.Xrm) {
      // Dashboard & sitemap standalone pages
      return (window as any).parent.Xrm;
    } else if ((window as any).opener && (window as any).opener.parent && (window as any).opener.parent.Xrm) {
      // Tree view dialogs (dialog opened from a form-hosted web resource)
      return (window as any).opener.parent.Xrm;
    } else if ((window as any).opener && (window as any).opener.opener && (window as any).opener.opener.Xrm) {
      // Dialog in a dialog (account i/s changes on save)
      return (window as any).opener.opener.Xrm;
    }
  }

  private static FormatRecords(records: any) {
    let formattedResults: any[] = [];

    if (records.length > 0) {
      for (var i = 0; i < records.length; i++) {
        let currentResult = records[i];
        let formattedResult: any = {};
        for (var key in currentResult) {
          if (key === "@odata.etag") {
            formattedResult.recordVersion = currentResult[key];
          } else if (key.indexOf("_") === 0) {
            // This is a lookup's property
            var attribute = key.substring(1, key.indexOf("_value"));
            if (!formattedResult[attribute]) {
              formattedResult[attribute] = {};
            }
            if (this.EndsWith(key, "_value")) {
              formattedResult[attribute].Id = currentResult[key];
            } else if (this.EndsWith(key, "_value@OData.Community.Display.V1.FormattedValue")) {
              formattedResult[attribute].Name = currentResult[key];
            } else if (this.EndsWith(key, "_value@Microsoft.Dynamics.CRM.lookuplogicalname")) {
              formattedResult[attribute].LogicalName = currentResult[key];
            }
          } else if (key.indexOf(".") > 0) {
            // Aliased values will contain a . after the alias name.  Using 0 to ensure we are grabbing an aliased value and not some other odata property starting with '.'
            var alias = key.substring(0, key.indexOf("."));
            var aliasedAttribute = key.substring(key.indexOf(".") + 1, key.length);
            if (!formattedResult[alias]) {
              formattedResult[alias] = {};
            }

            if (
              this.EndsWith(key, "@OData.Community.Display.V1.FormattedValue") ||
              this.EndsWith(key, "@Microsoft.Dynamics.CRM.lookuplogicalname") ||
              this.EndsWith(key, "@OData.Community.Display.V1.AttributeName")
            ) {
              // handle aliased when the id is processed
              continue;
            } else if (currentResult[key + "@Microsoft.Dynamics.CRM.lookuplogicalname"]) {
              // Try to identify if the current key is for a lookup or not.  Can't just assume lookups will end with 'id'.
              formattedResult[alias][aliasedAttribute] = {
                Id: currentResult[key],
                Name: currentResult[key + "@OData.Community.Display.V1.FormattedValue"],
                LogicalName: currentResult[key + "@Microsoft.Dynamics.CRM.lookuplogicalname"],
              };
            } else {
              formattedResult[alias][aliasedAttribute] = currentResult[key];
            }
          } else {
            formattedResult[key] = currentResult[key];
          }
        }
        formattedResults.push(formattedResult);
      }
    }

    return formattedResults;
  }

  private static EndsWith(str: any, suffix: any) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
}
