using System.Text;
using System.Text.Json;
using Inventory.API.Config;
using Inventory.API.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Inventory.API.Services.Translator;

public class AzureTranslatorService(IOptions<AzureSettings> options, HttpClient httpClient) : ITranslatorService
{
    private readonly AzureSettings _azureSettings = options.Value;

    public async Task<string> Translate(string polishWord, string targetLang = "en")
    {
        if (string.IsNullOrWhiteSpace(polishWord)) return polishWord;

        try
        {
            // Format azure translation API 2with region: [{"Text": "Polskie słowo"}]
            var requestBody = new object[] { new { Text = polishWord } };
            var jsonContent = JsonSerializer.Serialize(requestBody);
            
            using var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"/translate?api-version=3.0&from=pl&to={targetLang}", UriKind.Relative),
                Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
            };
            
            request.Headers.Add("Ocp-Apim-Subscription-Key", _azureSettings.TranslatorKey);
            request.Headers.Add("Ocp-Apim-Subscription-Region", _azureSettings.TranslatorRegion);

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            
            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            // Structure: [ { "translations": [ { "text": "Milk", ... } ] } ]
            var translatedText = doc.RootElement[0]
                .GetProperty("translations")[0]
                .GetProperty("text")
                .GetString();

            return translatedText ?? polishWord;
        }
        catch (Exception)
        {
            return polishWord; 
        }
    }
}