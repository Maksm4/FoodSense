using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services.Translator;

public class AzurePolishToEnglishTranslator : IPolishToEnglishTranslator
{
    public Task<string> Translate(string polishWord)
    {
        throw new NotImplementedException();
    }
}