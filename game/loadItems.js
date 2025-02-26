export async function loadItems() {
    console.log("🚀 loadItems() 호출됨! (JSON 데이터 불러오기 시도)");
    const response = await fetch("./items.json");
    if (!response.ok) throw new Error("🚨 JSON 파일을 불러올 수 없습니다!");
    return await response.json();
}



