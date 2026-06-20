using ExamForge.Application.Abstractions;
using ExamForge.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace ExamForge.Api.Controllers;

[ApiController]
[Route("api/sync")]
public sealed class SyncController : ControllerBase
{
    private readonly ISyncService _syncService;

    public SyncController(ISyncService syncService)
    {
        _syncService = syncService;
    }

    [HttpPost("upload")]
    [ProducesResponseType(typeof(SyncUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(
        [FromBody] SyncUploadRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _syncService.ProcessUploadAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (DomainException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("download")]
    [ProducesResponseType(typeof(SyncDownloadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Download(
        [FromQuery] long? sinceToken,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _syncService.GetChangesAsync(sinceToken, cancellationToken);
            return Ok(response);
        }
        catch (DomainException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
