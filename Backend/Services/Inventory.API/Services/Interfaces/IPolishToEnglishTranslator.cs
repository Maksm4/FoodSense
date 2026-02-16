namespace Inventory.API.Services.Interfaces;

public interface IPolishToEnglishTranslator
{
    Task<string> Translate(string polishWord);
}