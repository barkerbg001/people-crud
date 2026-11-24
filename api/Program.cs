var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var people = new List<Person>();

app.MapGet("/people", () => people);

app.MapGet("/people/{id}", (int id) =>
    people.FirstOrDefault(p => p.Id == id) is Person p ? Results.Ok(p) : Results.NotFound());

app.MapPost("/people", (Person p) =>
{
    p.Id = people.Count == 0 ? 1 : people.Max(x => x.Id) + 1;
    people.Add(p);
    return Results.Created($"/people/{p.Id}", p);
});

app.MapDelete("/people/{id}", (int id) =>
    people.RemoveAll(p => p.Id == id) > 0 ? Results.NoContent() : Results.NotFound());

app.Run();

class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Surname { get; set; } = "";
    public int Age { get; set; }
}
