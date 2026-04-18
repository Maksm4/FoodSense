namespace Inventory.API.Services.Interfaces;

public interface ITranslatorService
{
    Task<string> Translate(string polishWord, string targetLang );
}